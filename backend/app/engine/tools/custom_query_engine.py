import os
import asyncio
from llama_index.core.tools.query_engine import QueryEngineTool
from llama_index.core.tools.types import ToolOutput
from typing import Any
from llama_index.core.evaluation import FaithfulnessEvaluator
from llama_index.core.settings import Settings


class CustomQueryEngineTool(QueryEngineTool):
    async def acall(self, *args: Any, **kwargs: Any) -> ToolOutput:
        query_str = self._get_query_str(*args, **kwargs)

        # Use the standard asyncio event loop
        loop = asyncio.get_event_loop_policy().new_event_loop()
        asyncio.set_event_loop(loop)

        try:
            response = await self._query_engine.aquery(query_str)
            evaluator = FaithfulnessEvaluator(llm=Settings.llm)
            eval_result = await evaluator.aevaluate_response(response=response)

            result = str(response)
            if not eval_result.passing:
                result = os.getenv("NOT_IN_CONTEXT_PHRASE", "NOT IN CONTEXT")

            return ToolOutput(
                content=result,
                tool_name=self.metadata.name,
                raw_input={"input": query_str if eval_result.passing else result},
                raw_output=response,
            )
        finally:
            loop.close()