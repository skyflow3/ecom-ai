"""
Purpose: Image generation client for ECOM-AI funnel system.
         Primary: fal.ai API (Flux.1 [dev] + LoRA, ~$0.035/image)
         Fallback: ComfyUI local/remote (if GPU available)
Usage:
    from capabilities.image_gen import ImageGenerator, ImageGenRequest

    gen = ImageGenerator()  # auto-detects provider from env
    result = gen.generate(ImageGenRequest(
        prompt="premium turmeric supplement bottle, professional photography",
        lora_url="https://fal.ai/.../nutrovia.safetensors",
        width=1376,
        height=768,
        output_filename="nutrovia-hero",
    ))
    print(result.image_path)

CLI:
    python capabilities/image_gen.py --prompt "..." --preset hero --catalog

Providers:
    IMAGE_PROVIDER=fal       → fal.ai API (default, cloud, ~$0.035/image)
    IMAGE_PROVIDER=comfyui   → ComfyUI local/remote (needs GPU)

Environment:
    FAL_KEY              — fal.ai API key (required for provider=fal)
    COMFYUI_SERVER_URL   — ComfyUI server URL (default: http://localhost:8188)
    IMAGE_PROVIDER       — "fal" or "comfyui" (default: "fal")
    IMAGE_OUTPUT_DIR     — Where to save generated images (default: public/products)
"""

import json
import os
import sys
import time
import argparse
import urllib.request
import urllib.parse
from pathlib import Path
from dataclasses import dataclass, field
from typing import Optional

try:
    import fal_client
except ImportError:
    fal_client = None

try:
    import websocket
except ImportError:
    websocket = None


# ─── Configuration ──────────────────────────────────────────────────────────────

DEFAULT_PROVIDER = os.environ.get("IMAGE_PROVIDER", "fal")
DEFAULT_OUTPUT_DIR = os.environ.get("IMAGE_OUTPUT_DIR", "public/products")

# fal.ai endpoints
FAL_ENDPOINT_LORA = "fal-ai/flux-lora"          # Flux.1 [dev] + LoRA
FAL_ENDPOINT_PLAIN = "fal-ai/flux/dev"           # Flux.1 [dev] without LoRA
FAL_ENDPOINT_TRAIN = "fal-ai/flux-lora-fast-training"  # LoRA training

# ComfyUI defaults
COMFYUI_SERVER = os.environ.get("COMFYUI_SERVER_URL", "http://localhost:8188")
COMFYUI_MODEL = os.environ.get("COMFYUI_MODEL", "flux1-dev-Q4_K_M.gguf")

# Image presets matching funnel template requirements
# WHY: Each funnel template expects specific aspect ratios. Presets ensure consistency.
IMAGE_PRESETS = {
    "hero":      {"width": 1376, "height": 768,  "desc": "Main product hero (SmoothSpire, product page)"},
    "square":    {"width": 768,  "height": 768,  "desc": "Square product image (thumbnails)"},
    "doctor":    {"width": 512,  "height": 512,  "desc": "Doctor/expert portrait"},
    "logo":      {"width": 640,  "height": 160,  "desc": "Brand logo (4:1 ratio, upscale later)"},
    "review":    {"width": 400,  "height": 300,  "desc": "Facebook review screenshot replacement"},
    "upsell":    {"width": 600,  "height": 600,  "desc": "Upsell page product image"},
    "gallery":   {"width": 600,  "height": 700,  "desc": "Checkout gallery (front, side, top, in-box, in-use)"},
    "bundle_1x": {"width": 400,  "height": 400,  "desc": "Checkout bundle 1x thumbnail"},
    "bundle_3x": {"width": 400,  "height": 400,  "desc": "Checkout bundle 3x thumbnail"},
    "bundle_6x": {"width": 400,  "height": 400,  "desc": "Checkout bundle 6x thumbnail"},
}


# ─── Data Classes ────────────────────────────────────────────────────────────────

@dataclass
class ImageGenRequest:
    """Single image generation request. Provider-agnostic."""
    prompt: str
    lora_url: Optional[str] = None       # URL to LoRA file (fal.ai hosted or uploaded)
    lora_scale: float = 0.8              # LoRA strength (0.0-1.0)
    width: int = 1376
    height: int = 768
    steps: int = 28                      # Flux [dev] works best with 28 steps
    guidance: float = 3.5                # Flux [dev] default guidance
    seed: int = -1                       # -1 = random
    output_filename: str = "generated"
    output_dir: str = DEFAULT_OUTPUT_DIR
    preset: Optional[str] = None         # Use IMAGE_PRESETS key
    output_format: str = "png"           # "png" or "jpeg"

    def __post_init__(self):
        if self.preset and self.preset in IMAGE_PRESETS:
            p = IMAGE_PRESETS[self.preset]
            self.width = p["width"]
            self.height = p["height"]


@dataclass
class ImageGenResult:
    """Result of image generation."""
    success: bool
    image_path: Optional[str] = None
    image_url: Optional[str] = None      # Cloud URL (fal.ai)
    seed: Optional[int] = None
    generation_time: float = 0.0
    error: Optional[str] = None
    metadata: dict = field(default_factory=dict)


# ─── fal.ai Provider ─────────────────────────────────────────────────────────────

class FalProvider:
    """
    fal.ai image generation using Flux.1 [dev] + LoRA.

    WHY: Best price/performance for product image generation.
    - $0.035/image with LoRA (1 megapixel)
    - $0.025/image without LoRA
    - Native LoRA support (upload once, use instantly)
    - API-based, no GPU needed locally

    Docs: https://fal.ai/models/fal-ai/flux-lora
    """

    def __init__(self):
        if fal_client is None:
            raise ImportError("fal-client not installed. Run: pip install fal-client")
        api_key = os.environ.get("FAL_KEY")
        if not api_key:
            raise ValueError("FAL_KEY environment variable not set. Get one at https://fal.ai/dashboard/keys")

    def generate(self, request: ImageGenRequest) -> ImageGenResult:
        start_time = time.time()

        # Build fal.ai arguments
        arguments = {
            "prompt": request.prompt,
            "image_size": {"width": request.width, "height": request.height},
            "num_inference_steps": request.steps,
            "guidance_scale": request.guidance,
            "num_images": 1,
            "enable_safety_checker": False,  # Product images, no safety concern
            "output_format": request.output_format,
        }

        if request.seed >= 0:
            arguments["seed"] = request.seed

        # Add LoRA if provided
        if request.lora_url:
            arguments["loras"] = [{"path": request.lora_url, "scale": request.lora_scale}]
            endpoint = FAL_ENDPOINT_LORA
        else:
            endpoint = FAL_ENDPOINT_PLAIN

        try:
            result = fal_client.subscribe(endpoint, arguments=arguments)
        except Exception as e:
            return ImageGenResult(success=False, error=f"fal.ai API error: {e}")

        gen_time = time.time() - start_time

        # Extract image URL from result
        images = result.get("images", [])
        if not images:
            return ImageGenResult(success=False, error="No images in fal.ai response")

        image_url = images[0]["url"]
        returned_seed = result.get("seed")

        # Download and save to disk
        output_dir = Path(request.output_dir)
        output_dir.mkdir(parents=True, exist_ok=True)
        ext = "jpg" if request.output_format == "jpeg" else "png"
        output_path = output_dir / f"{request.output_filename}.{ext}"

        try:
            with urllib.request.urlopen(image_url, timeout=60) as resp:
                image_data = resp.read()
            with open(output_path, "wb") as f:
                f.write(image_data)
        except Exception as e:
            return ImageGenResult(
                success=False,
                error=f"Download failed: {e}",
                image_url=image_url,
                generation_time=gen_time,
            )

        return ImageGenResult(
            success=True,
            image_path=str(output_path),
            image_url=image_url,
            seed=returned_seed,
            generation_time=gen_time,
            metadata={
                "provider": "fal.ai",
                "endpoint": endpoint,
                "prompt": request.prompt,
                "lora_url": request.lora_url,
                "lora_scale": request.lora_scale,
                "width": request.width,
                "height": request.height,
                "steps": request.steps,
                "guidance": request.guidance,
                "seed": returned_seed,
            }
        )

    def upload_lora(self, file_path: str) -> str:
        """
        Upload a LoRA file to fal.ai storage.

        WHY: LoRA files must be hosted on fal.ai to use with the API.
        Upload once, get a URL that can be reused for all generations.

        Returns: URL of uploaded LoRA file
        """
        if fal_client is None:
            raise ImportError("fal-client not installed")
        return fal_client.upload_file(file_path)

    def train_lora(self, images_zip_path: str, trigger_word: str,
                   steps: int = 1000, is_style: bool = False) -> str:
        """
        Train a LoRA from product images.

        WHY: Product-specific LoRAs ensure visual consistency across all generated images.

        Args:
            images_zip_path: Path to ZIP file with training images (min 4, 10-20 recommended)
            trigger_word: Word to trigger the LoRA in prompts (e.g. "NUTROVIA")
            steps: Training steps (1000 default, more = better but slower)
            is_style: False for product/subject, True for art style

        Returns: URL of trained LoRA file (.safetensors)
        """
        if fal_client is None:
            raise ImportError("fal-client not installed")

        # Upload training images
        zip_url = fal_client.upload_file(images_zip_path)

        # Run training
        result = fal_client.subscribe(
            FAL_ENDPOINT_TRAIN,
            arguments={
                "images_data_url": zip_url,
                "trigger_word": trigger_word,
                "steps": steps,
                "is_style": is_style,
                "create_masks": True,
            },
        )

        lora_url = result["diffusers_lora_file"]["url"]
        return lora_url


# ─── ComfyUI Provider (Fallback) ─────────────────────────────────────────────────

class ComfyUIProvider:
    """
    ComfyUI local/remote provider. Used when GPU is available locally or on a server.

    WHY: Fallback for when cloud API is unavailable or for bulk generation.
    Requires a running ComfyUI instance with Flux GGUF models installed.
    """

    def __init__(self, server: str = COMFYUI_SERVER, timeout: int = 300):
        self.server = server.rstrip("/")
        self.server_address = server.replace("http://", "").replace("https://", "")
        self.timeout = timeout
        self.client_id = str(__import__("uuid").uuid4())

        if websocket is None:
            raise ImportError("websocket-client not installed. Run: pip install websocket-client")

    def check_health(self) -> bool:
        try:
            req = urllib.request.Request(f"{self.server}/system_stats")
            with urllib.request.urlopen(req, timeout=5) as resp:
                return resp.status == 200
        except Exception:
            return False

    def generate(self, request: ImageGenRequest) -> ImageGenResult:
        """Generate via ComfyUI websocket API."""
        import uuid as _uuid
        start_time = time.time()
        seed = request.seed if request.seed >= 0 else int(time.time() * 1000) % (2**32)

        # Build ComfyUI workflow
        workflow = self._build_workflow(request, seed)
        prompt_id = str(_uuid.uuid4())

        # Queue prompt
        try:
            payload = json.dumps({"prompt": workflow, "client_id": self.client_id, "prompt_id": prompt_id}).encode()
            req = urllib.request.Request(f"{self.server}/prompt", data=payload,
                                          headers={"Content-Type": "application/json"})
            with urllib.request.urlopen(req, timeout=30) as resp:
                resp_data = json.loads(resp.read())
                prompt_id = resp_data.get("prompt_id", prompt_id)
        except Exception as e:
            return ImageGenResult(success=False, error=f"ComfyUI queue failed: {e}")

        # Wait for completion
        try:
            ws = websocket.WebSocket()
            ws.settimeout(self.timeout)
            ws.connect(f"ws://{self.server_address}/ws?clientId={self.client_id}")
            deadline = time.time() + self.timeout
            while time.time() < deadline:
                out = ws.recv()
                if isinstance(out, str):
                    msg = json.loads(out)
                    if msg.get("type") == "execution_error":
                        ws.close()
                        return ImageGenResult(success=False, error=f"ComfyUI error: {msg.get('data', {})}")
                    if msg.get("type") == "executing":
                        data = msg.get("data", {})
                        if data.get("node") is None and data.get("prompt_id") == prompt_id:
                            break
            ws.close()
        except Exception as e:
            return ImageGenResult(success=False, error=f"ComfyUI websocket failed: {e}")

        # Get output images
        try:
            with urllib.request.urlopen(f"{self.server}/history/{prompt_id}", timeout=30) as resp:
                history = json.loads(resp.read())
            outputs = history.get(prompt_id, {}).get("outputs", {})
            image_data = None
            for node_output in outputs.values():
                for img in node_output.get("images", []):
                    params = urllib.parse.urlencode({
                        "filename": img["filename"],
                        "subfolder": img.get("subfolder", ""),
                        "type": img.get("type", "output"),
                    })
                    with urllib.request.urlopen(f"{self.server}/view?{params}", timeout=30) as img_resp:
                        image_data = img_resp.read()
                    break
                if image_data:
                    break
        except Exception as e:
            return ImageGenResult(success=False, error=f"ComfyUI image retrieval failed: {e}")

        if not image_data:
            return ImageGenResult(success=False, error="No images from ComfyUI")

        # Save
        output_dir = Path(request.output_dir)
        output_dir.mkdir(parents=True, exist_ok=True)
        output_path = output_dir / f"{request.output_filename}.png"
        with open(output_path, "wb") as f:
            f.write(image_data)

        return ImageGenResult(
            success=True,
            image_path=str(output_path),
            seed=seed,
            generation_time=time.time() - start_time,
            metadata={"provider": "comfyui", "model": COMFYUI_MODEL, "seed": seed},
        )

    def _build_workflow(self, request: ImageGenRequest, seed: int) -> dict:
        """Build Flux GGUF + LoRA workflow for ComfyUI."""
        wf = {
            "1": {"class_type": "UnetLoaderGGUF", "inputs": {"unet_name": COMFYUI_MODEL}},
            "2": {"class_type": "DualCLIPLoaderGGUF", "inputs": {
                "clip_name1": "clip_l.safetensors", "clip_name2": "t5xxl-Q8_0.gguf"}},
            "3": {"class_type": "VAELoader", "inputs": {"vae_name": "ae.safetensors"}},
        }
        if request.lora_url:
            # LoRA node
            wf["4"] = {"class_type": "LoraLoader", "inputs": {
                "model": ["1", 0], "clip": ["2", 0],
                "lora_name": request.lora_url.split("/")[-1],
                "strength_model": request.lora_scale, "strength_clip": request.lora_scale}}
            model_ref, clip_ref = ["4", 0], ["4", 1]
        else:
            model_ref, clip_ref = ["1", 0], ["2", 0]

        wf["5"] = {"class_type": "CLIPTextEncode", "inputs": {"clip": clip_ref, "text": request.prompt}}
        wf["6"] = {"class_type": "CLIPTextEncode", "inputs": {"clip": clip_ref, "text": ""}}
        wf["7"] = {"class_type": "EmptyLatentImage", "inputs": {"width": request.width, "height": request.height, "batch_size": 1}}
        wf["8"] = {"class_type": "KSampler", "inputs": {
            "model": model_ref, "positive": ["5", 0], "negative": ["6", 0],
            "latent_image": ["7", 0], "seed": seed, "steps": request.steps,
            "cfg": request.guidance, "sampler_name": "euler", "scheduler": "simple", "denoise": 1.0}}
        wf["9"] = {"class_type": "VAEDecode", "inputs": {"samples": ["8", 0], "vae": ["3", 0]}}
        wf["10"] = {"class_type": "SaveImage", "inputs": {"filename_prefix": request.output_filename, "images": ["9", 0]}}
        return wf


# ─── Unified Generator ───────────────────────────────────────────────────────────

class ImageGenerator:
    """
    Unified image generator. Auto-selects provider based on IMAGE_PROVIDER env var.

    WHY: AI agents use this single interface regardless of backend.
    Switch from fal.ai to ComfyUI by changing one env var.

    Usage:
        gen = ImageGenerator()
        result = gen.generate(ImageGenRequest(prompt="...", preset="hero"))
    """

    def __init__(self, provider: Optional[str] = None):
        provider = provider or DEFAULT_PROVIDER
        if provider == "fal":
            self._provider = FalProvider()
        elif provider == "comfyui":
            self._provider = ComfyUIProvider()
        else:
            raise ValueError(f"Unknown provider: {provider}. Use 'fal' or 'comfyui'.")
        self.provider_name = provider

    def generate(self, request: ImageGenRequest) -> ImageGenResult:
        return self._provider.generate(request)

    def generate_batch(self, requests: list) -> list:
        """Generate multiple images sequentially."""
        results = []
        for i, req in enumerate(requests):
            print(f"[{i+1}/{len(requests)}] {req.output_filename}...")
            result = self.generate(req)
            results.append(result)
            status = f"OK: {result.image_path} ({result.generation_time:.1f}s)" if result.success else f"FAIL: {result.error}"
            print(f"  {status}")
        return results

    def generate_product_catalog(self, product_slug: str, prompt_base: str,
                                  lora_url: Optional[str] = None) -> dict:
        """
        Generate complete product image catalog for the funnel system.

        WHY: Funnel templates need specific images at specific sizes.
        Generates all required images: hero, square, doctor, gallery, bundles, reviews.

        Args:
            product_slug: e.g. "nutrovia" — used for filenames
            prompt_base: Base prompt describing the product
            lora_url: LoRA file URL on fal.ai storage

        Returns:
            Dict mapping image type -> local file path
        """
        trigger = lora_url.split("/")[-1].replace(".safetensors", "").upper() if lora_url else product_slug.upper()

        catalog = {
            "productImageUrl":      {"prompt": f"{trigger}, {prompt_base}, hero shot, wide angle, professional product photography, studio lighting, white background", "preset": "hero"},
            "productImageSquareUrl": {"prompt": f"{trigger}, {prompt_base}, square frame, centered product, clean background, studio photography", "preset": "square"},
            "doctorImageUrl":       {"prompt": f"professional headshot of a friendly doctor in white coat, clean background, portrait photography, warm lighting, medical expert", "preset": "doctor"},
            "logoUrl":              {"prompt": f"minimalist brand logo for {product_slug}, clean design, white background, professional branding, modern typography", "preset": "logo"},
            "upsell_product":       {"prompt": f"{trigger}, {prompt_base}, product display, premium packaging, clean white background, e-commerce style", "preset": "upsell"},
            "bundle_1x":            {"prompt": f"{trigger}, single {product_slug} bottle, product photography, white background, clean studio shot", "preset": "bundle_1x"},
            "bundle_3x":            {"prompt": f"{trigger}, three {product_slug} bottles side by side, product photography, white background, bulk deal", "preset": "bundle_3x"},
            "bundle_6x":            {"prompt": f"{trigger}, six {product_slug} bottles arranged, product photography, white background, bulk value", "preset": "bundle_6x"},
        }

        # Gallery angles for checkout
        angles = ["front view", "side angle view", "top down view", "unboxed packaging view", "product in use lifestyle shot"]
        for i, angle in enumerate(angles):
            catalog[f"gallery_{i+1}"] = {
                "prompt": f"{trigger}, {prompt_base}, {angle}, professional product photography, studio lighting",
                "preset": "gallery",
            }

        # Facebook review screenshots
        for i in range(2):
            catalog[f"review_{i+1}"] = {
                "prompt": f"authentic social media review, positive customer testimonial about {product_slug}, happy customer, realistic screenshot style",
                "preset": "review",
            }

        results = {}
        output_dir = f"{DEFAULT_OUTPUT_DIR}/{product_slug}"
        for image_type, config in catalog.items():
            req = ImageGenRequest(
                prompt=config["prompt"],
                lora_url=lora_url,
                output_filename=f"{product_slug}-{image_type}",
                output_dir=output_dir,
                preset=config["preset"],
            )
            result = self.generate(req)
            if result.success:
                results[image_type] = result.image_path
            else:
                print(f"WARN: {image_type} failed: {result.error}")

        print(f"\nCatalog complete: {len(results)}/{len(catalog)} images generated")
        return results


# ─── CLI ──────────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Generate product images for ECOM-AI funnels")
    parser.add_argument("--prompt", help="Image generation prompt")
    parser.add_argument("--preset", choices=list(IMAGE_PRESETS.keys()), help="Image size preset")
    parser.add_argument("--width", type=int, default=1376, help="Image width")
    parser.add_argument("--height", type=int, default=768, help="Image height")
    parser.add_argument("--steps", type=int, default=28, help="Inference steps")
    parser.add_argument("--guidance", type=float, default=3.5, help="Guidance scale")
    parser.add_argument("--seed", type=int, default=-1, help="Random seed")
    parser.add_argument("--output", default="generated", help="Output filename")
    parser.add_argument("--output-dir", default=DEFAULT_OUTPUT_DIR, help="Output directory")
    parser.add_argument("--provider", default=DEFAULT_PROVIDER, choices=["fal", "comfyui"])
    parser.add_argument("--lora-url", help="LoRA file URL")
    parser.add_argument("--lora-scale", type=float, default=0.8, help="LoRA strength")
    parser.add_argument("--catalog", action="store_true", help="Generate full product catalog")
    parser.add_argument("--product-slug", default="product", help="Product slug for catalog")
    parser.add_argument("--train-lora", help="Train LoRA from ZIP of images")
    parser.add_argument("--trigger-word", help="Trigger word for LoRA training")
    parser.add_argument("--upload-lora", help="Upload LoRA file to fal.ai storage")
    parser.add_argument("--check", action="store_true", help="Check provider health")
    parser.add_argument("--format", default="png", choices=["png", "jpeg"], help="Output format")

    args = parser.parse_args()

    # ─── LoRA training
    if args.train_lora:
        if not args.trigger_word:
            print("ERROR: --trigger-word required for LoRA training")
            sys.exit(1)
        provider = FalProvider()
        print(f"Training LoRA: {args.train_lora} (trigger: {args.trigger_word})...")
        lora_url = provider.train_lora(args.train_lora, args.trigger_word)
        print(f"LoRA trained: {lora_url}")
        return

    # ─── LoRA upload
    if args.upload_lora:
        provider = FalProvider()
        print(f"Uploading: {args.upload_lora}...")
        url = provider.upload_lora(args.upload_lora)
        print(f"Uploaded: {url}")
        return

    # ─── Health check
    if args.check:
        if args.provider == "fal":
            if os.environ.get("FAL_KEY"):
                print("OK: FAL_KEY is set")
            else:
                print("FAIL: FAL_KEY not set. Get one at https://fal.ai/dashboard/keys")
                sys.exit(1)
        else:
            provider = ComfyUIProvider()
            if provider.check_health():
                print(f"OK: ComfyUI at {COMFYUI_SERVER}")
            else:
                print(f"FAIL: ComfyUI at {COMFYUI_SERVER} not responding")
                sys.exit(1)
        return

    # ─── Validate prompt
    if not args.prompt and not args.catalog:
        print("ERROR: --prompt is required (or use --catalog)")
        parser.print_help()
        sys.exit(1)

    gen = ImageGenerator(provider=args.provider)

    # ─── Full catalog
    if args.catalog:
        if not args.prompt:
            print("ERROR: --prompt required as base description for catalog")
            sys.exit(1)
        results = gen.generate_product_catalog(
            product_slug=args.product_slug,
            prompt_base=args.prompt,
            lora_url=args.lora_url,
        )
        print(f"\nGenerated {len(results)} images in {DEFAULT_OUTPUT_DIR}/{args.product_slug}/")
        return

    # ─── Single image
    request = ImageGenRequest(
        prompt=args.prompt,
        lora_url=args.lora_url,
        lora_scale=args.lora_scale,
        width=args.width,
        height=args.height,
        steps=args.steps,
        guidance=args.guidance,
        seed=args.seed,
        output_filename=args.output,
        output_dir=args.output_dir,
        preset=args.preset,
        output_format=args.format,
    )

    print(f"Provider: {args.provider} | {request.width}x{request.height}")
    result = gen.generate(request)

    if result.success:
        print(f"OK: {result.image_path}")
        if result.image_url:
            print(f"URL: {result.image_url}")
        print(f"Time: {result.generation_time:.1f}s | Seed: {result.seed}")
    else:
        print(f"FAIL: {result.error}")
        sys.exit(1)


if __name__ == "__main__":
    main()
