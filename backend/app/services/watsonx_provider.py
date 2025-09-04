import time

from ibm_watsonx_ai import APIClient, Credentials
from ibm_watsonx_ai import foundation_models as wx
from ibm_watsonx_ai.foundation_models import Embeddings

from app.core.config import settings
from app.core.singleton import Singleton


@Singleton
class WatsonxProvider:
    name = "watsonx"

    def __init__(self) -> None:
        start_time = time.time()

        self.client = APIClient(
            project_id=settings.WATSONX_PROJECT_ID,
            credentials=Credentials(
                url=settings.WATSONX_URL,
                api_key=settings.WATSONX_API_KEY,
            ),
        )
        print(f"APIClient initialization took {time.time() - start_time:.2f} seconds")
        self._model_inference_cache: dict[str, wx.inference.ModelInference] = {}

    def get_model_inference(self, model_id: str) -> wx.inference.ModelInference:
        if model_id not in self._model_inference_cache:
            start_time = time.time()
            self._model_inference_cache[model_id] = wx.inference.ModelInference(
                api_client=self.client, model_id=model_id
            )
            print(
                f"ModelInference for '{model_id}' initialized in {time.time() - start_time:.2f} seconds"
            )
        return self._model_inference_cache[model_id]

    def chat(
        self, model: str, messages: list[dict], parameters: dict = None
    ) -> str | None:
        if parameters is None:
            parameters = {}
        model_inference = self.get_model_inference(model)

        response = model_inference.chat(
            messages,
            params=wx.schema.TextChatParameters(
                temperature=parameters.get("temperature"),
                max_tokens=parameters.get("max_tokens"),
                top_p=parameters.get("top_p"),
                response_format=parameters.get("response_format"),
            ),
        )

        print(f"USAGE: {response.get('usage')}")

        if not (response and response.get("choices") and response.get("usage")):
            return None

        return response["choices"][0]["message"]["content"]
