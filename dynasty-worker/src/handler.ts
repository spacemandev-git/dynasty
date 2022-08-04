import { utils } from "ethers";
import { Env } from ".";

	export interface ScoringInterface {
		configHash: string;
		description: string;
		winner: string | undefined;
		startTime: number;
		endTime: number;
}

export interface SignedScoringInterface extends ScoringInterface {
	signature: string;
	message: string;
}

export interface SignedAddAdminMessage {
	address: string;
	signature: string;
	message: string;
}

export function getDefaultResponseHeaders() {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Credentials': JSON.stringify(true),
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS, DELETE, PATCH, PUT',
    'Access-Control-Allow-Headers':
      'X-Requested-With, Access-Control-Allow-Origin, X-HTTP-Method-Override, Content-Type, Authorization, Accept',
  }
}


function generateKeyFromRound(round: ScoringInterface) {
	return `${round.configHash}-${round.startTime}-${round.endTime}`;
}

export async function checkSignerAuthorized(message: string, sig: string, env: Env): Promise<boolean> {
	const addressFromSig = utils.verifyMessage(message, sig);
	const adminAddress = await env.DYNASTY_ADMIN.get(addressFromSig);
	return !!adminAddress;
}

export async function signerAuthorizationMiddleware(requestBody: 
	Pick<(SignedScoringInterface | SignedAddAdminMessage) , 'message' | 'signature'>, env: Env): Promise<Response | undefined> {
	const {signature, message} = requestBody;
	if (signature && message) {
		const authorized = await checkSignerAuthorized(message, signature, env);
		if (!authorized) {
			return new Response('Unauthorized', { status: 401, statusText: 'Unauthorized', headers: getDefaultResponseHeaders() });
		}
	} else {
		return new Response('Missing signature or message', { status: 400 });
	}
	return undefined;
}

export async function roundValidationMiddleware(requestBody: SignedScoringInterface, env: Env): Promise<Response|undefined> {
	const {startTime, endTime} = requestBody;

	await signerAuthorizationMiddleware(requestBody, env);	

 // @ts-ignore
	const currentRounds: {keys: ScoringInterface[]} = await env.DYNASTY_ROUNDS.list();

 const sameStartAndEnd = currentRounds.keys.filter((round) => {
	 return round.startTime === startTime && round.endTime === endTime;
 });
 if (sameStartAndEnd.length > 0) {
	 return new Response(JSON.stringify({message: "Round with same start and end time already exists"}), {
		 status: 400,
		 statusText: "Bad Request",
		 headers: getDefaultResponseHeaders()
	 });	
	}

	 const roundTimesOverlap = currentRounds.keys.filter((round) => {
    return (
      (startTime >= round.startTime && startTime <= round.endTime) ||
      (endTime >= round.startTime && endTime <= round.endTime)
    );
  });

  if (roundTimesOverlap.length > 0) {
		return new Response(JSON.stringify({message: "Round times overlap with existing round"}), {
			status: 400,
			statusText: "Bad Request",
			headers: getDefaultResponseHeaders()
		});
  }
}



export async function handleAddRound(request: Request, env: Env): Promise<Response> {
	let body: SignedScoringInterface = await request.json();
	const {configHash, description, startTime, endTime} = body;
	const roundInvalid = await roundValidationMiddleware(body, env);
	if (!roundInvalid) {
	const done = await env.DYNASTY_ROUNDS.put(generateKeyFromRound(body), JSON.stringify({
		configHash,
		description,
		winner: undefined,
		startTime,
		endTime, 
	}));
	console.log(done)
	return new Response(JSON.stringify({
		configHash,
		description,
		winner: undefined,
		startTime,
		endTime,
	}), {
		status: 200,
		headers: getDefaultResponseHeaders()
	});
} else {
	return roundInvalid;
}}

export async function handleDeleteRound(request: Request, params: {id:string}, env: Env): Promise<Response> {
	let body: SignedScoringInterface = await request.json();
	await signerAuthorizationMiddleware(body, env);
	await env.DYNASTY_ROUNDS.delete(params.id);
	return new Response(JSON.stringify({message: "successfully deleted."}), {
		status: 200,
		headers: getDefaultResponseHeaders()
	});
}

export async function handleEditRound(request: Request, params: {id: string}, env: Env): Promise<Response> {
	let body: SignedScoringInterface = await request.json();
	const roundInvalid = await roundValidationMiddleware(body, env);
	if (roundInvalid) return roundInvalid
	await env.DYNASTY_ROUNDS.delete(params.id);
	await env.DYNASTY_ROUNDS.put(params.id, JSON.stringify(body));
	return new Response(JSON.stringify({message: "successfully edited round."}), {
		status: 200,
		headers: getDefaultResponseHeaders()
	})
}

// export async function handleEditRound(request: Request) : Promise<Response>  {

// }



export async function handleGetRounds(env: Env) : Promise<Response> {

	const retrievedKeys: {keys: {name:string}[]} = await env.DYNASTY_ROUNDS.list();
	if (!!retrievedKeys) {
		let x: ScoringInterface[] = []
		for (const roundKey of retrievedKeys.keys) {
			const value = await env.DYNASTY_ROUNDS.get(roundKey.name);
			if (value !== null) {
				x.push(JSON.parse(value));
			}
		}
		const res =  new Response(JSON.stringify(x), {
			status: 200,
			headers: getDefaultResponseHeaders()
		});	
		return res
	} else {
		return new Response(JSON.stringify({message: "No rounds found"}), {
			status: 404,
			statusText: "Not Found",
			headers: getDefaultResponseHeaders()
		});
	}
}

export async function handleSelectRound(params: {id: string}, env: Env) : Promise<Response> {
	// const roundId = generateKeyFromRound(params);
	const round = await env.DYNASTY_ROUNDS.get(params.id);
	if (round) {
		return new Response(JSON.stringify(round), {
			status: 200,
			headers: getDefaultResponseHeaders()
		});
	}
	else {
		return new Response(JSON.stringify({message: "Round not found"}), {
			status: 404,
			statusText: "Not Found",
			headers: getDefaultResponseHeaders()
		});
	}
}


export async function handleAddAdmin(request: Request, env: Env) : Promise<Response> {
	let body: SignedAddAdminMessage = await request.json();
	const {address} = body;
	signerAuthorizationMiddleware(body, env);
		await env.DYNASTY_ADMIN.put(address, "");
		return new Response(JSON.stringify({
			message: `Admin ${address} added`	
		}), {
			status: 200,
			headers: getDefaultResponseHeaders()
		})
}

export async function handleRevokeAdmin(request: Request, params: {address: string}, env: Env) : Promise<Response> {
	console.log("ASKDJHAKSDHAKSDHKASHJD")
	let body: SignedAddAdminMessage = await request.json();
	console.log("BODY", body)
	signerAuthorizationMiddleware(body, env);
		await env.DYNASTY_ADMIN.delete(params.address);
		return new Response(null, {
			status: 200,
			headers: getDefaultResponseHeaders()
		})
}

export async function handleGetAdmins(env: Env) : Promise<Response> {
	// @ts-ignore
	const retrieved: {keys: {address:string, authorized:boolean}[]} = await env.DYNASTY_ADMIN.list();
	if (!!retrieved) {
		return new Response(JSON.stringify(retrieved.keys), {
			status: 200,
			headers: getDefaultResponseHeaders()
		});	
	} else {
		return new Response(JSON.stringify({message: "No admins found"}), {
			status: 404,
			statusText: "Not Found",
			headers: getDefaultResponseHeaders()
		});
	}
}