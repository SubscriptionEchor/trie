import { InferenceClient, INFERENCE_PROVIDERS, Options } from '@huggingface/inference';
import type { ChatCompletionInput, ChatCompletionOutput, ChatCompletionInputMessage } from "@huggingface/tasks";

interface FineTuningConfig {
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
}

interface ModelConfig {
    id: string;
    trendingScore: number;
    provider: {
        provider: string;
        providerId: string;
    }[];
}


export const modelsList: ModelConfig[] = [
    {
        "id": "deepseek-ai/DeepSeek-Prover-V2-671B",
        "trendingScore": 174,
        "provider": [
            {
                "provider": "novita",
                "providerId": "deepseek/deepseek-prover-v2-671b"
            }
        ]
    },
    {
        "id": "Qwen/Qwen3-235B-A22B",
        "trendingScore": 160,
        "provider": [
            {
                "provider": "fireworks-ai",
                "providerId": "accounts/fireworks/models/qwen3-235b-a22b"
            },
            {
                "provider": "hf-inference",
                "providerId": "Qwen/Qwen3-235B-A22B"
            },
            {
                "provider": "nebius",
                "providerId": "Qwen/Qwen3-235B-A22B"
            },
            {
                "provider": "novita",
                "providerId": "qwen/qwen3-235b-a22b-fp8"
            }
        ]
    },
    {
        "id": "Qwen/Qwen3-30B-A3B",
        "trendingScore": 112,
        "provider": [
            {
                "provider": "fireworks-ai",
                "providerId": "accounts/fireworks/models/qwen3-30b-a3b"
            },
            {
                "provider": "nebius",
                "providerId": "Qwen/Qwen3-30B-A3B-fast"
            },
            {
                "provider": "novita",
                "providerId": "qwen/qwen3-30b-a3b-fp8"
            }
        ]
    },
    {
        "id": "Qwen/Qwen3-32B",
        "trendingScore": 46,
        "provider": [
            {
                "provider": "hf-inference",
                "providerId": "Qwen/Qwen3-32B"
            },
            {
                "provider": "nebius",
                "providerId": "Qwen/Qwen3-32B"
            },
            {
                "provider": "novita",
                "providerId": "qwen/qwen3-32b-fp8"
            },
            {
                "provider": "sambanova",
                "providerId": "Qwen3-32B"
            }
        ]
    },
    {
        "id": "deepseek-ai/DeepSeek-R1",
        "trendingScore": 41,
        "provider": [
            {
                "provider": "fireworks-ai",
                "providerId": "accounts/fireworks/models/deepseek-r1"
            },
            {
                "provider": "hyperbolic",
                "providerId": "deepseek-ai/DeepSeek-R1"
            },
            {
                "provider": "nebius",
                "providerId": "deepseek-ai/DeepSeek-R1-fast"
            },
            {
                "provider": "novita",
                "providerId": "deepseek/deepseek-r1-turbo"
            },
            {
                "provider": "sambanova",
                "providerId": "DeepSeek-R1"
            },
            {
                "provider": "together",
                "providerId": "deepseek-ai/DeepSeek-R1"
            },
            {
                "provider": "featherless-ai",
                "providerId": "deepseek-ai/DeepSeek-R1"
            }
        ]
    },
    {
        "id": "google/gemma-3-27b-it",
        "trendingScore": 37,
        "provider": [
            {
                "provider": "nebius",
                "providerId": "google/gemma-3-27b-it-fast"
            },
            {
                "provider": "featherless-ai",
                "providerId": "google/gemma-3-27b-it"
            },
            {
                "provider": "hf-inference",
                "providerId": "google/gemma-3-27b-it"
            }
        ]
    },
    {
        "id": "Qwen/Qwen3-4B",
        "trendingScore": 37,
        "provider": [
            {
                "provider": "nebius",
                "providerId": "Qwen/Qwen3-4B-fast"
            }
        ]
    },
    {
        "id": "meta-llama/Llama-3.1-8B-Instruct",
        "trendingScore": 34,
        "provider": [
            {
                "provider": "fireworks-ai",
                "providerId": "accounts/fireworks/models/llama-v3p1-8b-instruct"
            },
            {
                "provider": "nebius",
                "providerId": "meta-llama/Meta-Llama-3.1-8B-Instruct-fast"
            },
            {
                "provider": "novita",
                "providerId": "meta-llama/llama-3.1-8b-instruct"
            },
            {
                "provider": "sambanova",
                "providerId": "Meta-Llama-3.1-8B-Instruct"
            },
            {
                "provider": "hf-inference",
                "providerId": "meta-llama/Llama-3.1-8B-Instruct"
            },
            {
                "provider": "featherless-ai",
                "providerId": "meta-llama/Meta-Llama-3.1-8B-Instruct"
            }
        ]
    },
    {
        "id": "deepseek-ai/DeepSeek-V3-0324",
        "trendingScore": 30,
        "provider": [
            {
                "provider": "fireworks-ai",
                "providerId": "accounts/fireworks/models/deepseek-v3-0324"
            },
            {
                "provider": "hyperbolic",
                "providerId": "deepseek-ai/DeepSeek-V3-0324"
            },
            {
                "provider": "nebius",
                "providerId": "deepseek-ai/DeepSeek-V3-0324-fast"
            },
            {
                "provider": "novita",
                "providerId": "deepseek/deepseek-v3-0324"
            },
            {
                "provider": "sambanova",
                "providerId": "DeepSeek-V3-0324"
            },
            {
                "provider": "featherless-ai",
                "providerId": "deepseek-ai/DeepSeek-V3-0324"
            }
        ]
    },
    {
        "id": "Qwen/Qwen3-14B",
        "trendingScore": 25,
        "provider": [
            {
                "provider": "nebius",
                "providerId": "Qwen/Qwen3-14B"
            }
        ]
    },
    {
        "id": "THUDM/GLM-4-32B-0414",
        "trendingScore": 25,
        "provider": [
            {
                "provider": "novita",
                "providerId": "thudm/glm-4-32b-0414"
            }
        ]
    },
    {
        "id": "Tesslate/UIGEN-T2-7B",
        "trendingScore": 24,
        "provider": [
            {
                "provider": "featherless-ai",
                "providerId": "Tesslate/UIGEN-T2-7B"
            }
        ]
    },
    {
        "id": "meta-llama/Llama-4-Scout-17B-16E-Instruct",
        "trendingScore": 23,
        "provider": [
            {
                "provider": "cerebras",
                "providerId": "llama-4-scout-17b-16e-instruct"
            },
            {
                "provider": "fireworks-ai",
                "providerId": "accounts/fireworks/models/llama4-scout-instruct-basic"
            },
            {
                "provider": "novita",
                "providerId": "meta-llama/llama-4-scout-17b-16e-instruct"
            },
            {
                "provider": "sambanova",
                "providerId": "Llama-4-Scout-17B-16E-Instruct"
            },
            {
                "provider": "together",
                "providerId": "meta-llama/Llama-4-Scout-17B-16E-Instruct"
            }
        ]
    },
    {
        "id": "meta-llama/Llama-3.2-3B-Instruct",
        "trendingScore": 22,
        "provider": [
            {
                "provider": "hyperbolic",
                "providerId": "meta-llama/Llama-3.2-3B-Instruct"
            },
            {
                "provider": "nebius",
                "providerId": "meta-llama/Llama-3.2-3B-Instruct"
            },
            {
                "provider": "novita",
                "providerId": "meta-llama/llama-3.2-3b-instruct"
            },
            {
                "provider": "sambanova",
                "providerId": "Meta-Llama-3.2-3B-Instruct"
            },
            {
                "provider": "together",
                "providerId": "meta-llama/Llama-3.2-3B-Instruct-Turbo"
            }
        ]
    },
    {
        "id": "mistralai/Mistral-7B-Instruct-v0.3",
        "trendingScore": 22,
        "provider": [
            {
                "provider": "hf-inference",
                "providerId": "mistralai/Mistral-7B-Instruct-v0.3"
            },
            {
                "provider": "novita",
                "providerId": "mistralai/mistral-7b-instruct"
            },
            {
                "provider": "together",
                "providerId": "mistralai/Mistral-7B-Instruct-v0.3"
            }
        ]
    },
    {
        "id": "meta-llama/Llama-3.3-70B-Instruct",
        "trendingScore": 20,
        "provider": [
            {
                "provider": "cerebras",
                "providerId": "llama-3.3-70b"
            },
            {
                "provider": "fireworks-ai",
                "providerId": "accounts/fireworks/models/llama-v3p3-70b-instruct"
            },
            {
                "provider": "hf-inference",
                "providerId": "meta-llama/Llama-3.3-70B-Instruct"
            },
            {
                "provider": "hyperbolic",
                "providerId": "meta-llama/Llama-3.3-70B-Instruct"
            },
            {
                "provider": "nebius",
                "providerId": "meta-llama/Llama-3.3-70B-Instruct-fast"
            },
            {
                "provider": "novita",
                "providerId": "meta-llama/llama-3.3-70b-instruct"
            },
            {
                "provider": "sambanova",
                "providerId": "Meta-Llama-3.3-70B-Instruct"
            },
            {
                "provider": "together",
                "providerId": "meta-llama/Llama-3.3-70B-Instruct-Turbo"
            }
        ]
    },
    {
        "id": "nvidia/Llama-3_1-Nemotron-Ultra-253B-v1",
        "trendingScore": 20,
        "provider": [
            {
                "provider": "nebius",
                "providerId": "nvidia/Llama-3_1-Nemotron-Ultra-253B-v1"
            }
        ]
    },
    {
        "id": "nvidia/Llama-3.1-Nemotron-Nano-8B-v1",
        "trendingScore": 18,
        "provider": [
            {
                "provider": "featherless-ai",
                "providerId": "nvidia/Llama-3.1-Nemotron-Nano-8B-v1"
            }
        ]
    },
    {
        "id": "Qwen/Qwen2.5-VL-7B-Instruct",
        "trendingScore": 18,
        "provider": [
            {
                "provider": "hyperbolic",
                "providerId": "Qwen/Qwen2.5-VL-7B-Instruct"
            }
        ]
    },
    {
        "id": "meta-llama/Llama-3.2-1B-Instruct",
        "trendingScore": 16,
        "provider": [
            {
                "provider": "nebius",
                "providerId": "meta-llama/Llama-3.2-1B-Instruct"
            },
            {
                "provider": "novita",
                "providerId": "meta-llama/llama-3.2-1b-instruct"
            },
            {
                "provider": "sambanova",
                "providerId": "Meta-Llama-3.2-1B-Instruct"
            }
        ]
    },
    {
        "id": "microsoft/phi-4",
        "trendingScore": 13,
        "provider": [
            {
                "provider": "nebius",
                "providerId": "microsoft/phi-4"
            },
            {
                "provider": "hf-inference",
                "providerId": "microsoft/phi-4"
            }
        ]
    },
    {
        "id": "Qwen/QwQ-32B",
        "trendingScore": 13,
        "provider": [
            {
                "provider": "fireworks-ai",
                "providerId": "accounts/fireworks/models/qwq-32b"
            },
            {
                "provider": "hf-inference",
                "providerId": "Qwen/QwQ-32B"
            },
            {
                "provider": "hyperbolic",
                "providerId": "Qwen/QwQ-32B"
            },
            {
                "provider": "nebius",
                "providerId": "Qwen/QwQ-32B-fast"
            },
            {
                "provider": "novita",
                "providerId": "qwen/qwq-32b"
            },
            {
                "provider": "sambanova",
                "providerId": "QwQ-32B"
            },
            {
                "provider": "featherless-ai",
                "providerId": "Qwen/QwQ-32B"
            }
        ]
    },
    {
        "id": "mistralai/Mistral-Small-3.1-24B-Instruct-2503",
        "trendingScore": 12,
        "provider": [
            {
                "provider": "featherless-ai",
                "providerId": "mistralai/Mistral-Small-3.1-24B-Instruct-2503"
            },
            {
                "provider": "hf-inference",
                "providerId": "mistralai/Mistral-Small-3.1-24B-Instruct-2503"
            },
            {
                "provider": "nebius",
                "providerId": "mistralai/Mistral-Small-3.1-24B-Instruct-2503"
            }
        ]
    },
    {
        "id": "meta-llama/Meta-Llama-3-8B-Instruct",
        "trendingScore": 10,
        "provider": [
            {
                "provider": "fireworks-ai",
                "providerId": "accounts/fireworks/models/llama-v3-8b-instruct"
            },
            {
                "provider": "novita",
                "providerId": "meta-llama/llama-3-8b-instruct"
            },
            {
                "provider": "together",
                "providerId": "meta-llama/Meta-Llama-3-8B-Instruct-Turbo"
            },
            {
                "provider": "featherless-ai",
                "providerId": "meta-llama/Meta-Llama-3-8B-Instruct"
            }
        ]
    },
    {
        "id": "deepseek-ai/DeepSeek-R1-Distill-Llama-8B",
        "trendingScore": 9,
        "provider": [
            {
                "provider": "novita",
                "providerId": "deepseek/deepseek-r1-distill-llama-8b"
            },
            {
                "provider": "featherless-ai",
                "providerId": "deepseek-ai/DeepSeek-R1-Distill-Llama-8B"
            }
        ]
    },
    {
        "id": "google/gemma-3-12b-it",
        "trendingScore": 8,
        "provider": [
            {
                "provider": "featherless-ai",
                "providerId": "google/gemma-3-12b-it"
            }
        ]
    },
    {
        "id": "meta-llama/Llama-4-Maverick-17B-128E-Instruct",
        "trendingScore": 8,
        "provider": [
            {
                "provider": "fireworks-ai",
                "providerId": "accounts/fireworks/models/llama4-maverick-instruct-basic"
            },
            {
                "provider": "sambanova",
                "providerId": "Llama-4-Maverick-17B-128E-Instruct"
            }
        ]
    },
    {
        "id": "mistralai/Mistral-7B-Instruct-v0.2",
        "trendingScore": 8,
        "provider": [
            {
                "provider": "featherless-ai",
                "providerId": "mistralai/Mistral-7B-Instruct-v0.2"
            }
        ]
    },
    {
        "id": "mistralai/Mistral-Nemo-Instruct-2407",
        "trendingScore": 8,
        "provider": [
            {
                "provider": "nebius",
                "providerId": "mistralai/Mistral-Nemo-Instruct-2407-fast"
            },
            {
                "provider": "featherless-ai",
                "providerId": "mistralai/Mistral-Nemo-Instruct-2407"
            },
            {
                "provider": "hf-inference",
                "providerId": "mistralai/Mistral-Nemo-Instruct-2407"
            }
        ]
    },
    {
        "id": "mistralai/Mixtral-8x7B-Instruct-v0.1",
        "trendingScore": 8,
        "provider": [
            {
                "provider": "fireworks-ai",
                "providerId": "accounts/fireworks/models/mixtral-8x7b-instruct"
            },
            {
                "provider": "nebius",
                "providerId": "mistralai/Mixtral-8x7B-Instruct-v0.1-fast"
            },
            {
                "provider": "together",
                "providerId": "mistralai/Mixtral-8x7B-Instruct-v0.1"
            },
            {
                "provider": "hf-inference",
                "providerId": "mistralai/Mixtral-8x7B-Instruct-v0.1"
            }
        ]
    },
    {
        "id": "Qwen/Qwen2.5-7B-Instruct",
        "trendingScore": 8,
        "provider": [
            {
                "provider": "together",
                "providerId": "Qwen/Qwen2.5-7B-Instruct-Turbo"
            },
            {
                "provider": "featherless-ai",
                "providerId": "Qwen/Qwen2.5-7B-Instruct"
            }
        ]
    },
    {
        "id": "Tesslate/Synthia-S1-27b",
        "trendingScore": 8,
        "provider": [
            {
                "provider": "featherless-ai",
                "providerId": "Tesslate/Synthia-S1-27b"
            }
        ]
    },
    {
        "id": "deepseek-ai/DeepSeek-R1-Distill-Qwen-7B",
        "trendingScore": 7,
        "provider": [
            {
                "provider": "featherless-ai",
                "providerId": "deepseek-ai/DeepSeek-R1-Distill-Qwen-7B"
            }
        ]
    },
    {
        "id": "nvidia/Llama-3_3-Nemotron-Super-49B-v1",
        "trendingScore": 7,
        "provider": [
            {
                "provider": "nebius",
                "providerId": "nvidia/Llama-3_3-Nemotron-Super-49B-v1"
            }
        ]
    },
    {
        "id": "Qwen/Qwen2-VL-72B-Instruct",
        "trendingScore": 7,
        "provider": [
            {
                "provider": "fireworks-ai",
                "providerId": "accounts/fireworks/models/qwen2-vl-72b-instruct"
            },
            {
                "provider": "hyperbolic",
                "providerId": "Qwen/Qwen2-VL-72B-Instruct"
            },
            {
                "provider": "nebius",
                "providerId": "Qwen/Qwen2-VL-72B-Instruct"
            },
            {
                "provider": "novita",
                "providerId": "qwen/qwen-2-vl-72b-instruct"
            }
        ]
    },
    {
        "id": "Qwen/Qwen2.5-Coder-32B-Instruct",
        "trendingScore": 7,
        "provider": [
            {
                "provider": "fireworks-ai",
                "providerId": "accounts/fireworks/models/qwen2p5-coder-32b-instruct"
            },
            {
                "provider": "hyperbolic",
                "providerId": "Qwen/Qwen2.5-Coder-32B-Instruct"
            },
            {
                "provider": "nebius",
                "providerId": "Qwen/Qwen2.5-Coder-32B-Instruct-fast"
            },
            {
                "provider": "together",
                "providerId": "Qwen/Qwen2.5-Coder-32B-Instruct"
            },
            {
                "provider": "featherless-ai",
                "providerId": "Qwen/Qwen2.5-Coder-32B-Instruct"
            },
            {
                "provider": "hf-inference",
                "providerId": "Qwen/Qwen2.5-Coder-32B-Instruct"
            }
        ]
    },
    {
        "id": "Qwen/Qwen2.5-Coder-7B-Instruct",
        "trendingScore": 7,
        "provider": [
            {
                "provider": "nebius",
                "providerId": "Qwen/Qwen2.5-Coder-7B-Instruct-fast"
            },
            {
                "provider": "featherless-ai",
                "providerId": "Qwen/Qwen2.5-Coder-7B-Instruct"
            }
        ]
    },
    {
        "id": "Qwen/Qwen3-235B-A22B-FP8",
        "trendingScore": 7,
        "provider": [
            {
                "provider": "together",
                "providerId": "Qwen/Qwen3-235B-A22B-fp8-tput"
            }
        ]
    },
    {
        "id": "THUDM/GLM-Z1-Rumination-32B-0414",
        "trendingScore": 7,
        "provider": [
            {
                "provider": "novita",
                "providerId": "thudm/glm-z1-rumination-32b-0414"
            }
        ]
    },
    {
        "id": "CohereLabs/aya-expanse-8b",
        "trendingScore": 6,
        "provider": [
            {
                "provider": "cohere",
                "providerId": "c4ai-aya-expanse-8b"
            }
        ]
    },
    {
        "id": "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B",
        "trendingScore": 6,
        "provider": [
            {
                "provider": "novita",
                "providerId": "deepseek/deepseek-r1-distill-qwen-32b"
            },
            {
                "provider": "hf-inference",
                "providerId": "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B"
            },
            {
                "provider": "featherless-ai",
                "providerId": "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B"
            }
        ]
    },
    {
        "id": "deepseek-ai/DeepSeek-V3",
        "trendingScore": 6,
        "provider": [
            {
                "provider": "fireworks-ai",
                "providerId": "accounts/fireworks/models/deepseek-v3"
            },
            {
                "provider": "nebius",
                "providerId": "deepseek-ai/DeepSeek-V3"
            },
            {
                "provider": "novita",
                "providerId": "deepseek/deepseek-v3-turbo"
            },
            {
                "provider": "together",
                "providerId": "deepseek-ai/DeepSeek-V3"
            }
        ]
    },
    {
        "id": "google/gemma-2-2b-it",
        "trendingScore": 6,
        "provider": [
            {
                "provider": "nebius",
                "providerId": "google/gemma-2-2b-it-fast"
            }
        ]
    },
    {
        "id": "HuggingFaceH4/zephyr-7b-beta",
        "trendingScore": 6,
        "provider": [
            {
                "provider": "hf-inference",
                "providerId": "HuggingFaceH4/zephyr-7b-beta"
            },
            {
                "provider": "featherless-ai",
                "providerId": "HuggingFaceH4/zephyr-7b-beta"
            }
        ]
    },
    {
        "id": "microsoft/Phi-3-mini-4k-instruct",
        "trendingScore": 6,
        "provider": [
            {
                "provider": "nebius",
                "providerId": "microsoft/Phi-3-mini-4k-instruct-fast"
            },
            {
                "provider": "hf-inference",
                "providerId": "microsoft/Phi-3-mini-4k-instruct"
            }
        ]
    },
    {
        "id": "microsoft/Phi-3.5-mini-instruct",
        "trendingScore": 6,
        "provider": [
            {
                "provider": "nebius",
                "providerId": "microsoft/Phi-3.5-mini-instruct"
            },
            {
                "provider": "hf-inference",
                "providerId": "microsoft/Phi-3.5-mini-instruct"
            }
        ]
    },
    {
        "id": "perplexity-ai/r1-1776",
        "trendingScore": 6,
        "provider": [
            {
                "provider": "fireworks-ai",
                "providerId": "accounts/perplexity/models/r1-1776"
            }
        ]
    },
    {
        "id": "PocketDoc/Dans-PersonalityEngine-V1.2.0-24b",
        "trendingScore": 6,
        "provider": [
            {
                "provider": "featherless-ai",
                "providerId": "PocketDoc/Dans-PersonalityEngine-V1.2.0-24b"
            }
        ]
    },
    {
        "id": "Qwen/Qwen2.5-VL-72B-Instruct",
        "trendingScore": 6,
        "provider": [
            {
                "provider": "hyperbolic",
                "providerId": "Qwen/Qwen2.5-VL-72B-Instruct"
            },
            {
                "provider": "nebius",
                "providerId": "Qwen/Qwen2.5-VL-72B-Instruct"
            }
        ]
    },
    {
        "id": "Tesslate/UIGEN-T1.5-32B",
        "trendingScore": 6,
        "provider": [
            {
                "provider": "featherless-ai",
                "providerId": "Tesslate/UIGEN-T1.5-32B"
            }
        ]
    },
    {
        "id": "aaditya/Llama3-OpenBioLLM-70B",
        "trendingScore": 5,
        "provider": [
            {
                "provider": "nebius",
                "providerId": "aaditya/Llama3-OpenBioLLM-70B"
            },
            {
                "provider": "featherless-ai",
                "providerId": "aaditya/Llama3-OpenBioLLM-70B"
            }
        ]
    },
    {
        "id": "all-hands/openhands-lm-32b-v0.1",
        "trendingScore": 5,
        "provider": [
            {
                "provider": "featherless-ai",
                "providerId": "all-hands/openhands-lm-32b-v0.1"
            }
        ]
    },
    {
        "id": "deepseek-ai/DeepSeek-Coder-V2-Lite-Instruct",
        "trendingScore": 5,
        "provider": [
            {
                "provider": "nebius",
                "providerId": "deepseek-ai/DeepSeek-Coder-V2-Lite-Instruct-fast"
            }
        ]
    },
    {
        "id": "deepseek-ai/DeepSeek-R1-Distill-Qwen-14B",
        "trendingScore": 5,
        "provider": [
            {
                "provider": "novita",
                "providerId": "deepseek/deepseek-r1-distill-qwen-14b"
            },
            {
                "provider": "featherless-ai",
                "providerId": "deepseek-ai/DeepSeek-R1-Distill-Qwen-14B"
            }
        ]
    },
    {
        "id": "Qwen/Qwen2.5-1.5B-Instruct",
        "trendingScore": 5,
        "provider": [
            {
                "provider": "nebius",
                "providerId": "Qwen/Qwen2.5-1.5B-Instruct"
            }
        ]
    },
    {
        "id": "THUDM/GLM-Z1-32B-0414",
        "trendingScore": 5,
        "provider": [
            {
                "provider": "novita",
                "providerId": "thudm/glm-z1-32b-0414"
            }
        ]
    },
    {
        "id": "llava-hf/llava-1.5-7b-hf",
        "trendingScore": 4,
        "provider": [
            {
                "provider": "nebius",
                "providerId": "llava-hf/llava-1.5-7b-hf"
            }
        ]
    },
    {
        "id": "meta-llama/Llama-3.2-11B-Vision-Instruct",
        "trendingScore": 4,
        "provider": [
            {
                "provider": "fireworks-ai",
                "providerId": "accounts/fireworks/models/llama-v3p2-11b-vision-instruct"
            },
            {
                "provider": "novita",
                "providerId": "meta-llama/llama-3.2-11b-vision-instruct"
            },
            {
                "provider": "together",
                "providerId": "meta-llama/Llama-3.2-11B-Vision-Instruct"
            },
            {
                "provider": "hf-inference",
                "providerId": "meta-llama/Llama-3.2-11B-Vision-Instruct"
            }
        ]
    },
    {
        "id": "NousResearch/DeepHermes-3-Llama-3-8B-Preview",
        "trendingScore": 4,
        "provider": [
            {
                "provider": "featherless-ai",
                "providerId": "NousResearch/DeepHermes-3-Llama-3-8B-Preview"
            }
        ]
    },
    {
        "id": "Orenguteng/Llama-3.1-8B-Lexi-Uncensored-V2",
        "trendingScore": 4,
        "provider": [
            {
                "provider": "featherless-ai",
                "providerId": "Orenguteng/Llama-3.1-8B-Lexi-Uncensored-V2"
            }
        ]
    },
    {
        "id": "Qwen/Qwen2.5-Coder-7B",
        "trendingScore": 4,
        "provider": [
            {
                "provider": "nebius",
                "providerId": "Qwen/Qwen2.5-Coder-7B-fast"
            }
        ]
    },
    {
        "id": "Qwen/Qwen2.5-VL-32B-Instruct",
        "trendingScore": 4,
        "provider": [
            {
                "provider": "hf-inference",
                "providerId": "Qwen/Qwen2.5-VL-32B-Instruct"
            }
        ]
    },
    {
        "id": "Salesforce/Llama-xLAM-2-70b-fc-r",
        "trendingScore": 4,
        "provider": [
            {
                "provider": "featherless-ai",
                "providerId": "Salesforce/Llama-xLAM-2-70b-fc-r"
            }
        ]
    },
    {
        "id": "THUDM/GLM-4-9B-0414",
        "trendingScore": 4,
        "provider": [
            {
                "provider": "novita",
                "providerId": "thudm/glm-4-9b-0414"
            }
        ]
    },
    {
        "id": "CohereLabs/c4ai-command-r7b-arabic-02-2025",
        "trendingScore": 3,
        "provider": [
            {
                "provider": "cohere",
                "providerId": "command-r7b-arabic-02-2025"
            }
        ]
    },
    {
        "id": "google/gemma-2-9b-it",
        "trendingScore": 3,
        "provider": [
            {
                "provider": "nebius",
                "providerId": "google/gemma-2-9b-it-fast"
            },
            {
                "provider": "novita",
                "providerId": "google/gemma-2-9b-it"
            }
        ]
    },
    {
        "id": "meta-llama/Llama-2-13b-chat-hf",
        "trendingScore": 3,
        "provider": [
            {
                "provider": "together",
                "providerId": "meta-llama/Llama-2-13b-chat-hf"
            },
            {
                "provider": "featherless-ai",
                "providerId": "meta-llama/Llama-2-13b-chat-hf"
            }
        ]
    },
    {
        "id": "mlabonne/gemma-3-27b-it-abliterated",
        "trendingScore": 3,
        "provider": [
            {
                "provider": "featherless-ai",
                "providerId": "mlabonne/gemma-3-27b-it-abliterated"
            }
        ]
    },
    {
        "id": "nvidia/AceMath-RL-Nemotron-7B",
        "trendingScore": 3,
        "provider": [
            {
                "provider": "featherless-ai",
                "providerId": "nvidia/AceMath-RL-Nemotron-7B"
            }
        ]
    },
    {
        "id": "nvidia/OpenMath-Nemotron-32B",
        "trendingScore": 3,
        "provider": [
            {
                "provider": "featherless-ai",
                "providerId": "nvidia/OpenMath-Nemotron-32B"
            }
        ]
    },
    {
        "id": "Qwen/Qwen2-VL-7B-Instruct",
        "trendingScore": 3,
        "provider": [
            {
                "provider": "hyperbolic",
                "providerId": "Qwen/Qwen2-VL-7B-Instruct"
            },
            {
                "provider": "nebius",
                "providerId": "Qwen/Qwen2-VL-7B-Instruct"
            }
        ]
    },
    {
        "id": "Qwen/Qwen2.5-72B-Instruct",
        "trendingScore": 3,
        "provider": [
            {
                "provider": "fireworks-ai",
                "providerId": "accounts/fireworks/models/qwen2p5-72b-instruct"
            },
            {
                "provider": "hf-inference",
                "providerId": "Qwen/Qwen2.5-72B-Instruct"
            },
            {
                "provider": "hyperbolic",
                "providerId": "Qwen/Qwen2.5-72B-Instruct"
            },
            {
                "provider": "nebius",
                "providerId": "Qwen/Qwen2.5-72B-Instruct-fast"
            },
            {
                "provider": "novita",
                "providerId": "qwen/qwen-2.5-72b-instruct"
            },
            {
                "provider": "together",
                "providerId": "Qwen/Qwen2.5-72B-Instruct-Turbo"
            },
            {
                "provider": "featherless-ai",
                "providerId": "Qwen/Qwen2.5-72B-Instruct"
            }
        ]
    },
    {
        "id": "Qwen/Qwen2.5-7B-Instruct-1M",
        "trendingScore": 3,
        "provider": [
            {
                "provider": "featherless-ai",
                "providerId": "Qwen/Qwen2.5-7B-Instruct-1M"
            }
        ]
    },
    {
        "id": "soob3123/Veiled-Calla-12B",
        "trendingScore": 3,
        "provider": [
            {
                "provider": "featherless-ai",
                "providerId": "soob3123/Veiled-Calla-12B"
            }
        ]
    },
    {
        "id": "beomi/Llama-3-Open-Ko-8B",
        "trendingScore": 2,
        "provider": [
            {
                "provider": "featherless-ai",
                "providerId": "beomi/Llama-3-Open-Ko-8B"
            }
        ]
    },
    {
        "id": "CohereLabs/aya-expanse-32b",
        "trendingScore": 2,
        "provider": [
            {
                "provider": "cohere",
                "providerId": "c4ai-aya-expanse-32b"
            }
        ]
    },
    {
        "id": "CohereLabs/aya-vision-8b",
        "trendingScore": 2,
        "provider": [
            {
                "provider": "cohere",
                "providerId": "c4ai-aya-vision-8b"
            }
        ]
    },
    {
        "id": "CohereLabs/c4ai-command-r-08-2024",
        "trendingScore": 2,
        "provider": [
            {
                "provider": "cohere",
                "providerId": "command-r-08-2024"
            }
        ]
    },
    {
        "id": "DreadPoor/Irix-12B-Model_Stock",
        "trendingScore": 2,
        "provider": [
            {
                "provider": "featherless-ai",
                "providerId": "DreadPoor/Irix-12B-Model_Stock"
            }
        ]
    },
    {
        "id": "EVA-UNIT-01/EVA-LLaMA-3.33-70B-v0.1",
        "trendingScore": 2,
        "provider": [
            {
                "provider": "featherless-ai",
                "providerId": "EVA-UNIT-01/EVA-LLaMA-3.33-70B-v0.1"
            }
        ]
    },
    {
        "id": "google/gemma-2b-it",
        "trendingScore": 2,
        "provider": [
            {
                "provider": "together",
                "providerId": "google/gemma-2-27b-it"
            }
        ]
    },
    {
        "id": "huihui-ai/Llama-3.3-70B-Instruct-abliterated",
        "trendingScore": 2,
        "provider": [
            {
                "provider": "featherless-ai",
                "providerId": "huihui-ai/Llama-3.3-70B-Instruct-abliterated"
            }
        ]
    },
    {
        "id": "huihui-ai/Mistral-Small-24B-Instruct-2501-abliterated",
        "trendingScore": 2,
        "provider": [
            {
                "provider": "featherless-ai",
                "providerId": "huihui-ai/Mistral-Small-24B-Instruct-2501-abliterated"
            }
        ]
    },
    {
        "id": "LatitudeGames/Wayfarer-Large-70B-Llama-3.3",
        "trendingScore": 2,
        "provider": [
            {
                "provider": "featherless-ai",
                "providerId": "LatitudeGames/Wayfarer-Large-70B-Llama-3.3"
            }
        ]
    },
    {
        "id": "meta-llama/Llama-3.1-70B-Instruct",
        "trendingScore": 2,
        "provider": [
            {
                "provider": "nebius",
                "providerId": "meta-llama/Meta-Llama-3.1-70B-Instruct-fast"
            },
            {
                "provider": "novita",
                "providerId": "meta-llama/llama-3.1-70b-instruct"
            },
            {
                "provider": "featherless-ai",
                "providerId": "meta-llama/Meta-Llama-3.1-70B-Instruct"
            }
        ]
    },
    {
        "id": "meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8",
        "trendingScore": 2,
        "provider": [
            {
                "provider": "novita",
                "providerId": "meta-llama/llama-4-maverick-17b-128e-instruct-fp8"
            },
            {
                "provider": "together",
                "providerId": "meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8"
            }
        ]
    },
    {
        "id": "meta-llama/Meta-Llama-3-70B-Instruct",
        "trendingScore": 2,
        "provider": [
            {
                "provider": "fireworks-ai",
                "providerId": "accounts/fireworks/models/llama-v3-70b-instruct"
            },
            {
                "provider": "hyperbolic",
                "providerId": "meta-llama/Meta-Llama-3-70B-Instruct"
            },
            {
                "provider": "novita",
                "providerId": "meta-llama/llama-3-70b-instruct"
            },
            {
                "provider": "together",
                "providerId": "meta-llama/Llama-3-70b-chat-hf"
            },
            {
                "provider": "featherless-ai",
                "providerId": "meta-llama/Meta-Llama-3-70B-Instruct"
            }
        ]
    },
    {
        "id": "Nitral-AI/Captain-Eris_Violet-V0.420-12B",
        "trendingScore": 2,
        "provider": [
            {
                "provider": "featherless-ai",
                "providerId": "Nitral-AI/Captain-Eris_Violet-V0.420-12B"
            }
        ]
    },
    {
        "id": "NousResearch/Meta-Llama-3-8B-Instruct",
        "trendingScore": 2,
        "provider": [
            {
                "provider": "featherless-ai",
                "providerId": "NousResearch/Meta-Llama-3-8B-Instruct"
            }
        ]
    },
    {
        "id": "NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO",
        "trendingScore": 2,
        "provider": [
            {
                "provider": "together",
                "providerId": "NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO"
            }
        ]
    },
    {
        "id": "nvidia/Llama-3.1-Nemotron-70B-Instruct-HF",
        "trendingScore": 2,
        "provider": [
            {
                "provider": "nebius",
                "providerId": "nvidia/Llama-3.1-Nemotron-70B-Instruct-HF-fast"
            },
            {
                "provider": "together",
                "providerId": "nvidia/Llama-3.1-Nemotron-70B-Instruct-HF"
            },
            {
                "provider": "hf-inference",
                "providerId": "nvidia/Llama-3.1-Nemotron-70B-Instruct-HF"
            },
            {
                "provider": "featherless-ai",
                "providerId": "nvidia/Llama-3.1-Nemotron-70B-Instruct-HF"
            }
        ]
    },
    {
        "id": "open-thoughts/OpenThinker2-32B",
        "trendingScore": 2,
        "provider": [
            {
                "provider": "featherless-ai",
                "providerId": "open-thoughts/OpenThinker2-32B"
            }
        ]
    },
    {
        "id": "PygmalionAI/Pygmalion-3-12B",
        "trendingScore": 2,
        "provider": [
            {
                "provider": "featherless-ai",
                "providerId": "PygmalionAI/Pygmalion-3-12B"
            }
        ]
    },
    {
        "id": "Qwen/QVQ-72B-Preview",
        "trendingScore": 2,
        "provider": [
            {
                "provider": "nebius",
                "providerId": "Qwen/QVQ-72B-preview"
            }
        ]
    },
    {
        "id": "Qwen/Qwen2.5-32B-Instruct",
        "trendingScore": 2,
        "provider": [
            {
                "provider": "nebius",
                "providerId": "Qwen/Qwen2.5-32B-Instruct-fast"
            },
            {
                "provider": "featherless-ai",
                "providerId": "Qwen/Qwen2.5-32B-Instruct"
            }
        ]
    },
    {
        "id": "Qwen/Qwen2.5-7B",
        "trendingScore": 2,
        "provider": [
            {
                "provider": "featherless-ai",
                "providerId": "Qwen/Qwen2.5-7B"
            }
        ]
    },
    {
        "id": "Qwen/Qwen2.5-Coder-32B",
        "trendingScore": 2,
        "provider": [
            {
                "provider": "featherless-ai",
                "providerId": "Qwen/Qwen2.5-Coder-32B"
            }
        ]
    },
    {
        "id": "Qwen/Qwen2.5-Math-7B",
        "trendingScore": 2,
        "provider": [
            {
                "provider": "featherless-ai",
                "providerId": "Qwen/Qwen2.5-Math-7B"
            }
        ]
    },
    {
        "id": "Salesforce/Llama-xLAM-2-8b-fc-r",
        "trendingScore": 2,
        "provider": [
            {
                "provider": "featherless-ai",
                "providerId": "Salesforce/Llama-xLAM-2-8b-fc-r"
            }
        ]
    },
    {
        "id": "Sao10K/L3-8B-Stheno-v3.2",
        "trendingScore": 2,
        "provider": [
            {
                "provider": "featherless-ai",
                "providerId": "Sao10K/L3-8B-Stheno-v3.2"
            },
            {
                "provider": "novita",
                "providerId": "Sao10K/L3-8B-Stheno-v3.2"
            }
        ]
    },
    {
        "id": "Sao10K/L3.3-70B-Euryale-v2.3",
        "trendingScore": 2,
        "provider": [
            {
                "provider": "featherless-ai",
                "providerId": "Sao10K/L3.3-70B-Euryale-v2.3"
            }
        ]
    },
    {
        "id": "SentientAGI/Dobby-Mini-Unhinged-Llama-3.1-8B",
        "trendingScore": 2,
        "provider": [
            {
                "provider": "featherless-ai",
                "providerId": "SentientAGI/Dobby-Mini-Unhinged-Llama-3.1-8B"
            }
        ]
    },
    {
        "id": "shenzhi-wang/Llama3-8B-Chinese-Chat",
        "trendingScore": 2,
        "provider": [
            {
                "provider": "featherless-ai",
                "providerId": "shenzhi-wang/Llama3-8B-Chinese-Chat"
            }
        ]
    },
    {
        "id": "THUDM/GLM-Z1-9B-0414",
        "trendingScore": 2,
        "provider": [
            {
                "provider": "novita",
                "providerId": "thudm/glm-z1-9b-0414"
            }
        ]
    },
    {
        "id": "allura-org/Gemma-3-Glitter-12B",
        "trendingScore": 1,
        "provider": [
            {
                "provider": "featherless-ai",
                "providerId": "allura-org/Gemma-3-Glitter-12B"
            }
        ]
    },
    {
        "id": "allura-org/Gemma-3-Glitter-27B",
        "trendingScore": 1,
        "provider": [
            {
                "provider": "featherless-ai",
                "providerId": "allura-org/Gemma-3-Glitter-27B"
            }
        ]
    },
    {
        "id": "alpindale/WizardLM-2-8x22B",
        "trendingScore": 1,
        "provider": [
            {
                "provider": "novita",
                "providerId": "microsoft/wizardlm-2-8x22b"
            },
            {
                "provider": "featherless-ai",
                "providerId": "alpindale/WizardLM-2-8x22B"
            }
        ]
    },
    {
        "id": "braindao/gemma-3-27b-it-uncensored",
        "trendingScore": 1,
        "provider": [
            {
                "provider": "featherless-ai",
                "providerId": "braindao/gemma-3-27b-it-uncensored"
            }
        ]
    },
    {
        "id": "CohereLabs/aya-vision-32b",
        "trendingScore": 1,
        "provider": [
            {
                "provider": "cohere",
                "providerId": "c4ai-aya-vision-32b"
            }
        ]
    },
    {
        "id": "CohereLabs/c4ai-command-r-plus",
        "trendingScore": 1,
        "provider": [
            {
                "provider": "cohere",
                "providerId": "command-r-plus-04-2024"
            }
        ]
    },
    {
        "id": "CohereLabs/c4ai-command-r-v01",
        "trendingScore": 1,
        "provider": [
            {
                "provider": "cohere",
                "providerId": "command-r-03-2024"
            }
        ]
    },
    {
        "id": "diffnamehard/Mistral-CatMacaroni-slerp-uncensored-7B",
        "trendingScore": 1,
        "provider": [
            {
                "provider": "featherless-ai",
                "providerId": "diffnamehard/Mistral-CatMacaroni-slerp-uncensored-7B"
            }
        ]
    },
    {
        "id": "GritLM/GritLM-7B",
        "trendingScore": 1,
        "provider": [
            {
                "provider": "featherless-ai",
                "providerId": "GritLM/GritLM-7B"
            }
        ]
    },
    {
        "id": "HuggingFaceH4/zephyr-7b-alpha",
        "trendingScore": 1,
        "provider": [
            {
                "provider": "featherless-ai",
                "providerId": "HuggingFaceH4/zephyr-7b-alpha"
            }
        ]
    },
    {
        "id": "IlyaGusev/saiga_llama3_8b",
        "trendingScore": 1,
        "provider": [
            {
                "provider": "featherless-ai",
                "providerId": "IlyaGusev/saiga_llama3_8b"
            }
        ]
    },
    {
        "id": "meta-llama/Llama-3.2-90B-Vision-Instruct",
        "trendingScore": 1,
        "provider": [
            {
                "provider": "fireworks-ai",
                "providerId": "accounts/fireworks/models/llama-v3p2-90b-vision-instruct"
            },
            {
                "provider": "together",
                "providerId": "meta-llama/Llama-3.2-90B-Vision-Instruct"
            }
        ]
    },
    {
        "id": "microsoft/Phi-3.5-vision-instruct",
        "trendingScore": 1,
        "provider": [
            {
                "provider": "fireworks-ai",
                "providerId": "accounts/fireworks/models/phi-3-vision-128k-instruct"
            }
        ]
    },
    {
        "id": "mistralai/Mixtral-8x22B-Instruct-v0.1",
        "trendingScore": 1,
        "provider": [
            {
                "provider": "fireworks-ai",
                "providerId": "accounts/fireworks/models/mixtral-8x22b-instruct"
            },
            {
                "provider": "nebius",
                "providerId": "mistralai/Mixtral-8x22B-Instruct-v0.1-fast"
            },
            {
                "provider": "together",
                "providerId": "mistralai/Mixtral-8x22B-Instruct-v0.1"
            }
        ]
    },
    {
        "id": "MLP-KTLim/llama-3-Korean-Bllossom-8B",
        "trendingScore": 1,
        "provider": [
            {
                "provider": "featherless-ai",
                "providerId": "MLP-KTLim/llama-3-Korean-Bllossom-8B"
            }
        ]
    },
    {
        "id": "nvidia/Llama3-ChatQA-1.5-70B",
        "trendingScore": 1,
        "provider": [
            {
                "provider": "featherless-ai",
                "providerId": "nvidia/Llama3-ChatQA-1.5-70B"
            }
        ]
    },
    {
        "id": "speakleash/Bielik-7B-Instruct-v0.1",
        "trendingScore": 1,
        "provider": [
            {
                "provider": "featherless-ai",
                "providerId": "speakleash/Bielik-7B-Instruct-v0.1"
            }
        ]
    },
    {
        "id": "teknium/OpenHermes-2.5-Mistral-7B",
        "trendingScore": 1,
        "provider": [
            {
                "provider": "novita",
                "providerId": "teknium/openhermes-2.5-mistral-7b"
            }
        ]
    },
    {
        "id": "timpal0l/Mistral-7B-v0.1-flashback-v2",
        "trendingScore": 1,
        "provider": [
            {
                "provider": "featherless-ai",
                "providerId": "timpal0l/Mistral-7B-v0.1-flashback-v2"
            }
        ]
    },
    {
        "id": "ToastyPigeon/Gemma-3-Starshine-12B",
        "trendingScore": 1,
        "provider": [
            {
                "provider": "featherless-ai",
                "providerId": "ToastyPigeon/Gemma-3-Starshine-12B"
            }
        ]
    },
    {
        "id": "llava-hf/llava-1.5-13b-hf",
        "trendingScore": 0,
        "provider": [
            {
                "provider": "nebius",
                "providerId": "llava-hf/llava-1.5-13b-hf"
            }
        ]
    }
]

let modelProviderMap1 = {};
for (const model of modelsList) {
    modelProviderMap1[model.id] = model.provider[0].provider;
}
export const modelProviderMap = modelProviderMap1;

async function getActiveInferenceModels(): Promise<ModelConfig[]> {
    try {
        const url = 'https://huggingface-inference-playground.hf.space/api/models';
        const response = await fetch(url);
        if (!response.ok) {
            console.error('Error fetching models:', response.statusText);
            return [];
        }
        const allModels = await response.json();

        const final = allModels
            .map((model) => ({
                id: model.id,
                trendingScore: parseInt(model.trendingScore),
                provider: model.inferenceProviderMapping
                    .filter((provider) => provider.status === 'live')
                    .map((provider) => ({
                        provider: provider.provider,
                        providerId: provider.providerId
                    }))
            }))
            .filter((model) => model.provider.length > 0)
            .sort((a, b) => a.trendingScore - b.trendingScore);

        return final;
    } catch (error) {
        console.error('Error fetching inference models:', error);
        return [];
    }
}

const hf = new InferenceClient("");

export async function completeChat(
    model: string,
    messages: ChatCompletionInputMessage[],
    provider: string | null = null,
    fineTuningConfig: FineTuningConfig = {}
): Promise<any[]> {
    let payload = {
        model: model,
        messages: messages,
        provider: provider || modelProviderMap[model],
        ...fineTuningConfig
    }
    const res = await hf.chatCompletion(payload);
    return res.choices.map((choice) => {
        return {
            role: choice.message.role,
            content: choice.message.content,
        }
    });
}
