/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { Router } from "itty-router";
import {
  handleAddAdmin,
  handleAddRound,
  handleDeleteRound,
  handleEditRound,
  handleGetAdmins,
  handleGetRounds,
  handleRevokeAdmin,
  handleSelectRound,
  ScoringInterface,
  SignedScoringInterface,
} from "./handler";

export interface Env {
  DYNASTY_ADMIN: KVNamespace;
  DYNASTY_ROUNDS: KVNamespace;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const router = Router();
    ////////////////////////////
    // ROUNDS
    ////////////////////////////

    router.options("/rounds/:id", handleCors);

    router.post(
      "/rounds",
      async (request: Request, env: Env): Promise<Response> => {
        return handleAddRound(request, env);
      }
    );

    router.get("/rounds", (_: Request, env: Env): Promise<Response> => {
      return handleGetRounds(env);
    });

    router.get(
      "/rounds/:id",
      ({ params }: { params: { id: string } }, env: Env): Promise<Response> => {
        return handleSelectRound(params, env);
      }
    );

    router.delete(
      "/rounds/:id",
      ({ params }: { params: { id: string } }, env: Env): Promise<Response> => {
        return handleDeleteRound(request, params, env);
      }
    );

    router.put(
      "/rounds/:id",
      ({ params }: { params: { id: string } }, env: Env): Promise<Response> => {
        return handleEditRound(request, params, env);
      }
    );

    ////////////////////////////
    // ADMINS
    ////////////////////////////

    router.options("/admins/:address", handleCors);

    router.get("/admins", (_: Request, env: Env): Promise<Response> => {
      return handleGetAdmins(env);
    });

    router.post("/admins/", (request: Request, env: Env): Promise<Response> => {
      return handleAddAdmin(request, env);
    });

    router.delete(
      "/admins/:address",
      (
        request: Request,
        params: { address: string },
        env: Env
      ): Promise<Response> => {
        return handleRevokeAdmin(request, params, env);
      }
    );

    return router.handle(request, env);
  },
};

export const handleCors = (request: Request) => {
  if (request.headers.get("Origin") !== null) {
    const headers: Record<string, string> = {
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers":
        "referer, origin, content-type, sentry-trace, cache-control",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Max-Age": "86400",
      "Access-Control-Allow-Origin": "*",
    };

    // Handle CORS pre-flight request
    return new Response(null, {
      status: 204,
      headers,
    });
  }

  // Handle standard OPTIONS request
  return new Response(null, {
    headers: {
      // Allow: methods.join(', '),
      Allow: "GET, POST, DELETE, PUT",
    },
  });
};
