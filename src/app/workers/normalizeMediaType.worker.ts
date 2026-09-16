// app/normalize.worker.ts
import { normalizeData } from "@utils/normalizeData";
import { Genre, MediaTypes } from "@utils/types/types";
import { PopularResponseType } from "../utils/types/modefiedTypes";

type ArrayInput = MediaTypes | PopularResponseType[];

interface WorkerInput {
  mediaTypes: ArrayInput | undefined;
  aggregateGenre: Genre[];
}

self.onmessage = (event: MessageEvent<WorkerInput>) => {
  // Extract data from event.data
  const { mediaTypes, aggregateGenre } = event.data;

  // Process data
  const normalized = normalizeData(mediaTypes, aggregateGenre);

  // Send the result back to the main thread
  self.postMessage(normalized);
};
