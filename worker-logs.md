fetch
POST /v1/chat/completions
HTTP 200

Timestamp
2025-07-27 19:30:35:902
UTC
Wall Time
4808
ms
CPU Time
22
ms
Request Id
965e8d5cac669beb
$metadata.message
2025-07-27 19:30:35:902
UTC
POST https://gemini-cli-worker-2.vallangirakesh.workers.dev/v1/chat/completions
Search properties by key or value
{
message:
 
"POST https://gemini-cli-worker-2.vallangirakesh.workers.dev/v1/chat/completions",
level:
 
"info",
$workers:
 
{
event:
 
{
request:
 
{
cf:
 
{
requestHeaderNames:
 
{},
isEUCountry:
 
false,
httpProtocol:
 
"HTTP/1.1",
clientAcceptEncoding:
 
"gzip,deflate",
requestPriority:
 
"",
colo:
 
"MAA",
asOrganization:
 
"Atria Convergence Technologies Ltd.,",
country:
 
"IN",
city:
 
"Vijayawada",
continent:
 
"AS",
region:
 
"Andhra Pradesh",
regionCode:
 
"AP",
timezone:
 
"Asia/Kolkata",
longitude:
 
"80.6466",
latitude:
 
"16.50745",
postalCode:
 
"520004",
tlsVersion:
 
"TLSv1.3",
tlsCipher:
 
"AEAD-AES128-GCM-SHA256",
tlsClientRandom:
 
"JkwbO+HxW7yLjhAKOmR7hR6tW8tp5xpfQ1y9pxFJfK4=",
tlsClientCiphersSha1:
 
"tLt94YkR/yUiWQeOc4ow07DiA9U=",
tlsClientExtensionsSha1:
 
"/KdboeBKvsYpmQ6za4zdVuBsiNI=",
tlsClientExtensionsSha1Le:
 
"/lJ3tmmNsOdTGuMdlEckOd/pH8o=",
tlsExportedAuthenticator:
 
{
clientHandshake:
 
"0c8c46cf73e017c76eef61d9295cf79fe9d1735bb3a32e57c4e7d46779ff0dcd",
serverHandshake:
 
"184d23eb731c116bd397fc3f16aa7aa47951da9a4fe4eba5c0c6c045705c044c",
clientFinished:
 
"fc2fa460f6fc73eb8283eb22c832f58d68cbc8dcca46de5d6ac9378e657c123f",
serverFinished:
 
"545418e384c94a639e8dcddc9be6578f76df60e795492e6b258dff62b1857b6c"
},
tlsClientHelloLength:
 
"508",
tlsClientAuth:
 
{
certPresented:
 
"0",
certVerified:
 
"NONE",
certRevoked:
 
"0",
certIssuerDN:
 
"",
certSubjectDN:
 
"",
certIssuerDNRFC2253:
 
"",
certSubjectDNRFC2253:
 
"",
certIssuerDNLegacy:
 
"",
certSubjectDNLegacy:
 
"",
certSerial:
 
"",
certIssuerSerial:
 
"",
certSKI:
 
"",
certIssuerSKI:
 
"",
certFingerprintSHA1:
 
"",
certFingerprintSHA256:
 
"",
certNotBefore:
 
"",
certNotAfter:
 
""
},
verifiedBotCategory:
 
"",
edgeRequestKeepAliveStatus:
 
1,
clientTcpRtt:
 
44,
asn:
 
131269,
},
url:
 
"https://gemini-cli-worker-2.vallangirakesh.workers.dev/v1/chat/completions",
method:
 
"POST",
headers:
 
{
accept:
 
"application/json",
accept-encoding:
 
"gzip,deflate",
authorization:
 
"********",
cf-connecting-ip:
 
"49.205.96.69",
cf-ipcountry:
 
"IN",
cf-pref-ob:
 
"0",
cf-ray:
 
"965e8d5cac669beb",
cf-use-ob:
 
"0",
cf-visitor:
 
"{"scheme":"https"}",
content-length:
 
"403462",
content-type:
 
"application/json",
host:
 
"gemini-cli-worker-2.vallangirakesh.workers.dev",
user-agent:
 
"so/JS 4.83.0",
x-forwarded-proto:
 
"https",
x-stainless-arch:
 
"arm64",
x-stainless-lang:
 
"js",
x-stainless-os:
 
"MacOS",
x-stainless-package-version:
 
"4.83.0",
x-stainless-retry-count:
 
"0",
x-stainless-runtime:
 
"node",
x-stainless-runtime-version:
 
"v20.19.0",
x-stainless-timeout:
 
"600000"
},
path:
 
"/v1/chat/completions"
},
rayId:
 
"965e8d5cac669beb",
executionModel:
 
"stateless",
response:
 
{
status:
 
200,
}
},
diagnosticsChannelEvents:
 
[],
truncated:
 
false,
scriptName:
 
"gemini-cli-worker-2",
outcome:
 
"ok",
eventType:
 
"fetch",
scriptVersion:
 
{
id:
 
"7b1634d6-6abf-487b-a4f8-a19c838574fd"
},
requestId:
 
"965e8d5cac669beb",
cpuTimeMs:
 
22,
wallTimeMs:
 
4808,
},
$metadata:
 
{
id:
 
"01K16NV5QYTKXCAD2742EHB1B4",
requestId:
 
"965e8d5cac669beb",
trigger:
 
"POST /v1/chat/completions",
service:
 
"gemini-cli-worker-2",
level:
 
"info",
message:
 
"POST https://gemini-cli-worker-2.vallangirakesh.workers.dev/v1/chat/completions",
account:
 
"4d4c141be2eb9d769c8ed0e5d4609bc9",
type:
 
"cf-worker-event",
fingerprint:
 
"29a47e9163170a79ef8ccad48844cb8a",
origin:
 
"fetch",
messageTemplate:
 
"POST https://gemini-cli-worker-2.vallangirakesh.workers.dev/v1/chat/completions",
}
}
2025-07-27 19:30:35:906
UTC
[2025-07-27T19:30:35.902Z] POST /v1/chat/completions - Body: { "model": "gemini-2.5-pro", "messages": [ { "role": "user", "content": "You are Cline, a highly skilled software engineer with extensive knowledge in many programming languages, frameworks, design patterns, and best practices.\n\n====\n\nTOOL USE\n\nYou have access to a set of tools that are executed upon the user's approval. You can use one tool per message, and will receive the result of that tool use in the user's response. You use tools step-by-step to accomplish a given... - Request started
Search properties by key or value
{
message:
 
"[2025-07-27T19:30:35.902Z] POST /v1/chat/completions - Body: { "model": "gemini-2.5-pro", "messages": [ { "role": "user", "content": "You are Cline, a highly skilled software engineer with extensive knowledge in many programming languages, frameworks, design patterns, and best practices.\n\n====\n\nTOOL USE\n\nYou have access to a set of tools that are executed upon the user's approval. You can use one tool per message, and will receive the result of that tool use in the user's response. You use tools step-by-step to accomplish a given... - Request started",
$workers:
 
{
truncated:
 
false,
event:
 
{
request:
 
{
url:
 
"https://gemini-cli-worker-2.vallangirakesh.workers.dev/v1/chat/completions",
method:
 
"POST",
path:
 
"/v1/chat/completions"
}
},
outcome:
 
"ok",
scriptName:
 
"gemini-cli-worker-2",
eventType:
 
"fetch",
executionModel:
 
"stateless",
scriptVersion:
 
{
id:
 
"7b1634d6-6abf-487b-a4f8-a19c838574fd"
},
requestId:
 
"965e8d5cac669beb"
},
$metadata:
 
{
id:
 
"01K16NV5R2X717QJWNVZBKNGPM",
requestId:
 
"965e8d5cac669beb",
trigger:
 
"POST /v1/chat/completions",
service:
 
"gemini-cli-worker-2",
message:
 
"[2025-07-27T19:30:35.902Z] POST /v1/chat/completions - Body: { "model": "gemini-2.5-pro", "messages": [ { "role": "user", "content": "You are Cline, a highly skilled software engineer with extensive knowledge in many programming languages, frameworks, design patterns, and best practices.\n\n====\n\nTOOL USE\n\nYou have access to a set of tools that are executed upon the user's approval. You can use one tool per message, and will receive the result of that tool use in the user's response. You use tools step-by-step to accomplish a given... - Request started",
account:
 
"4d4c141be2eb9d769c8ed0e5d4609bc9",
type:
 
"cf-worker",
fingerprint:
 
"29a47e9163170a79ef8ccad48844cb8a",
origin:
 
"fetch",
messageTemplate:
 
"[<DATETIME>] POST /v1/chat/completions - Body: { "model": "gemini-2.5-pro", "messages": [ { "role": "user", "content": "You are Cline, a highly skilled software engineer with extensive knowledge in many programming languages, frameworks, design patterns, and best practices.\n\n====\n\nTOOL USE\n\nYou have access to a set of tools that are executed upon the user's approval. You can use one tool per message, and will receive the result of that tool use in the user's response. You use tools step-by-step to accomplish a given... - Request started",
}
}
2025-07-27 19:30:35:906
UTC
Chat completions request received
Search properties by key or value
{
message:
 
"Chat completions request received",
$workers:
 
{
truncated:
 
false,
event:
 
{
request:
 
{
url:
 
"https://gemini-cli-worker-2.vallangirakesh.workers.dev/v1/chat/completions",
method:
 
"POST",
path:
 
"/v1/chat/completions"
}
},
outcome:
 
"ok",
scriptName:
 
"gemini-cli-worker-2",
eventType:
 
"fetch",
executionModel:
 
"stateless",
scriptVersion:
 
{
id:
 
"7b1634d6-6abf-487b-a4f8-a19c838574fd"
},
requestId:
 
"965e8d5cac669beb"
},
$metadata:
 
{
id:
 
"01K16NV5R2X717QJWNVZBKNGPN",
requestId:
 
"965e8d5cac669beb",
trigger:
 
"POST /v1/chat/completions",
service:
 
"gemini-cli-worker-2",
message:
 
"Chat completions request received",
account:
 
"4d4c141be2eb9d769c8ed0e5d4609bc9",
type:
 
"cf-worker",
fingerprint:
 
"29a47e9163170a79ef8ccad48844cb8a",
origin:
 
"fetch",
messageTemplate:
 
"Chat completions request received",
}
}
2025-07-27 19:30:35:906
UTC
Request body parsed:
Search properties by key or value
{
thinkingBudget:
 
-1,
messageCount:
 
45,
model:
 
"gemini-2.5-pro",
message:
 
"Request body parsed:",
includeReasoning:
 
true,
stream:
 
true,
$workers:
 
{
truncated:
 
false,
event:
 
{
request:
 
{
url:
 
"https://gemini-cli-worker-2.vallangirakesh.workers.dev/v1/chat/completions",
method:
 
"POST",
path:
 
"/v1/chat/completions"
}
},
outcome:
 
"ok",
scriptName:
 
"gemini-cli-worker-2",
eventType:
 
"fetch",
executionModel:
 
"stateless",
scriptVersion:
 
{
id:
 
"7b1634d6-6abf-487b-a4f8-a19c838574fd"
},
requestId:
 
"965e8d5cac669beb"
},
$metadata:
 
{
id:
 
"01K16NV5R2X717QJWNVZBKNGPP",
requestId:
 
"965e8d5cac669beb",
trigger:
 
"POST /v1/chat/completions",
service:
 
"gemini-cli-worker-2",
message:
 
"Request body parsed:",
account:
 
"4d4c141be2eb9d769c8ed0e5d4609bc9",
type:
 
"cf-worker",
fingerprint:
 
"29a47e9163170a79ef8ccad48844cb8a",
origin:
 
"fetch",
messageTemplate:
 
"Request body parsed:",
}
}
2025-07-27 19:30:35:906
UTC
Starting stream generation
Search properties by key or value
{
message:
 
"Starting stream generation",
$workers:
 
{
truncated:
 
false,
event:
 
{
request:
 
{
url:
 
"https://gemini-cli-worker-2.vallangirakesh.workers.dev/v1/chat/completions",
method:
 
"POST",
path:
 
"/v1/chat/completions"
}
},
outcome:
 
"ok",
scriptName:
 
"gemini-cli-worker-2",
eventType:
 
"fetch",
executionModel:
 
"stateless",
scriptVersion:
 
{
id:
 
"7b1634d6-6abf-487b-a4f8-a19c838574fd"
},
requestId:
 
"965e8d5cac669beb"
},
$metadata:
 
{
id:
 
"01K16NV5R2X717QJWNVZBKNGPQ",
requestId:
 
"965e8d5cac669beb",
trigger:
 
"POST /v1/chat/completions",
service:
 
"gemini-cli-worker-2",
message:
 
"Starting stream generation",
account:
 
"4d4c141be2eb9d769c8ed0e5d4609bc9",
type:
 
"cf-worker",
fingerprint:
 
"29a47e9163170a79ef8ccad48844cb8a",
origin:
 
"fetch",
messageTemplate:
 
"Starting stream generation",
}
}
2025-07-27 19:30:35:906
UTC
[GenerationConfig] Real thinking enabled for 'gemini-2.5-pro' with budget: -1
Search properties by key or value
{
message:
 
"[GenerationConfig] Real thinking enabled for 'gemini-2.5-pro' with budget: -1",
$workers:
 
{
truncated:
 
false,
event:
 
{
request:
 
{
url:
 
"https://gemini-cli-worker-2.vallangirakesh.workers.dev/v1/chat/completions",
method:
 
"POST",
path:
 
"/v1/chat/completions"
}
},
outcome:
 
"ok",
scriptName:
 
"gemini-cli-worker-2",
eventType:
 
"fetch",
executionModel:
 
"stateless",
scriptVersion:
 
{
id:
 
"7b1634d6-6abf-487b-a4f8-a19c838574fd"
},
requestId:
 
"965e8d5cac669beb"
},
$metadata:
 
{
id:
 
"01K16NV5R2X717QJWNVZBKNGPR",
requestId:
 
"965e8d5cac669beb",
trigger:
 
"POST /v1/chat/completions",
service:
 
"gemini-cli-worker-2",
message:
 
"[GenerationConfig] Real thinking enabled for 'gemini-2.5-pro' with budget: -1",
account:
 
"4d4c141be2eb9d769c8ed0e5d4609bc9",
type:
 
"cf-worker",
fingerprint:
 
"29a47e9163170a79ef8ccad48844cb8a",
origin:
 
"fetch",
messageTemplate:
 
"[GenerationConfig] Real thinking enabled for 'gemini-2.5-pro' with budget: -1",
}
}
2025-07-27 19:30:35:906
UTC
Returning streaming response
Search properties by key or value
{
message:
 
"Returning streaming response",
$workers:
 
{
truncated:
 
false,
event:
 
{
request:
 
{
url:
 
"https://gemini-cli-worker-2.vallangirakesh.workers.dev/v1/chat/completions",
method:
 
"POST",
path:
 
"/v1/chat/completions"
}
},
outcome:
 
"ok",
scriptName:
 
"gemini-cli-worker-2",
eventType:
 
"fetch",
executionModel:
 
"stateless",
scriptVersion:
 
{
id:
 
"7b1634d6-6abf-487b-a4f8-a19c838574fd"
},
requestId:
 
"965e8d5cac669beb"
},
$metadata:
 
{
id:
 
"01K16NV5R2X717QJWNVZBKNGPS",
requestId:
 
"965e8d5cac669beb",
trigger:
 
"POST /v1/chat/completions",
service:
 
"gemini-cli-worker-2",
message:
 
"Returning streaming response",
account:
 
"4d4c141be2eb9d769c8ed0e5d4609bc9",
type:
 
"cf-worker",
fingerprint:
 
"29a47e9163170a79ef8ccad48844cb8a",
origin:
 
"fetch",
messageTemplate:
 
"Returning streaming response",
}
}
2025-07-27 19:30:35:906
UTC
[2025-07-27T19:30:35.906Z] POST /v1/chat/completions - Completed with status 200 (4ms)
Search properties by key or value
{
message:
 
"[2025-07-27T19:30:35.906Z] POST /v1/chat/completions - Completed with status 200 (4ms)",
$workers:
 
{
truncated:
 
false,
event:
 
{
request:
 
{
url:
 
"https://gemini-cli-worker-2.vallangirakesh.workers.dev/v1/chat/completions",
method:
 
"POST",
path:
 
"/v1/chat/completions"
}
},
outcome:
 
"ok",
scriptName:
 
"gemini-cli-worker-2",
eventType:
 
"fetch",
executionModel:
 
"stateless",
scriptVersion:
 
{
id:
 
"7b1634d6-6abf-487b-a4f8-a19c838574fd"
},
requestId:
 
"965e8d5cac669beb"
},
$metadata:
 
{
id:
 
"01K16NV5R2X717QJWNVZBKNGPT",
requestId:
 
"965e8d5cac669beb",
trigger:
 
"POST /v1/chat/completions",
service:
 
"gemini-cli-worker-2",
message:
 
"[2025-07-27T19:30:35.906Z] POST /v1/chat/completions - Completed with status 200 (4ms)",
account:
 
"4d4c141be2eb9d769c8ed0e5d4609bc9",
type:
 
"cf-worker",
fingerprint:
 
"29a47e9163170a79ef8ccad48844cb8a",
origin:
 
"fetch",
messageTemplate:
 
"[<DATETIME>] POST /v1/chat/completions - Completed with status 200 (4ms)",
}
}
2025-07-27 19:30:36:295
UTC
Found cached token in KV storage
Search properties by key or value
{
message:
 
"Found cached token in KV storage",
$workers:
 
{
truncated:
 
false,
event:
 
{
request:
 
{
url:
 
"https://gemini-cli-worker-2.vallangirakesh.workers.dev/v1/chat/completions",
method:
 
"POST",
path:
 
"/v1/chat/completions"
}
},
outcome:
 
"ok",
scriptName:
 
"gemini-cli-worker-2",
eventType:
 
"fetch",
executionModel:
 
"stateless",
scriptVersion:
 
{
id:
 
"7b1634d6-6abf-487b-a4f8-a19c838574fd"
},
requestId:
 
"965e8d5cac669beb"
},
$metadata:
 
{
id:
 
"01K16NV6472RY8D9NYPFWRS3JD",
requestId:
 
"965e8d5cac669beb",
trigger:
 
"POST /v1/chat/completions",
service:
 
"gemini-cli-worker-2",
message:
 
"Found cached token in KV storage",
account:
 
"4d4c141be2eb9d769c8ed0e5d4609bc9",
type:
 
"cf-worker",
fingerprint:
 
"29a47e9163170a79ef8ccad48844cb8a",
origin:
 
"fetch",
messageTemplate:
 
"Found cached token in KV storage",
}
}
2025-07-27 19:30:36:295
UTC
Cached token expired or expiring soon
Search properties by key or value
{
message:
 
"Cached token expired or expiring soon",
$workers:
 
{
truncated:
 
false,
event:
 
{
request:
 
{
url:
 
"https://gemini-cli-worker-2.vallangirakesh.workers.dev/v1/chat/completions",
method:
 
"POST",
path:
 
"/v1/chat/completions"
}
},
outcome:
 
"ok",
scriptName:
 
"gemini-cli-worker-2",
eventType:
 
"fetch",
executionModel:
 
"stateless",
scriptVersion:
 
{
id:
 
"7b1634d6-6abf-487b-a4f8-a19c838574fd"
},
requestId:
 
"965e8d5cac669beb"
},
$metadata:
 
{
id:
 
"01K16NV6472RY8D9NYPFWRS3JE",
requestId:
 
"965e8d5cac669beb",
trigger:
 
"POST /v1/chat/completions",
service:
 
"gemini-cli-worker-2",
message:
 
"Cached token expired or expiring soon",
account:
 
"4d4c141be2eb9d769c8ed0e5d4609bc9",
type:
 
"cf-worker",
fingerprint:
 
"29a47e9163170a79ef8ccad48844cb8a",
origin:
 
"fetch",
messageTemplate:
 
"Cached token expired or expiring soon",
}
}
2025-07-27 19:30:36:295
UTC
All tokens expired, refreshing...
Search properties by key or value
{
message:
 
"All tokens expired, refreshing...",
$workers:
 
{
truncated:
 
false,
event:
 
{
request:
 
{
url:
 
"https://gemini-cli-worker-2.vallangirakesh.workers.dev/v1/chat/completions",
method:
 
"POST",
path:
 
"/v1/chat/completions"
}
},
outcome:
 
"ok",
scriptName:
 
"gemini-cli-worker-2",
eventType:
 
"fetch",
executionModel:
 
"stateless",
scriptVersion:
 
{
id:
 
"7b1634d6-6abf-487b-a4f8-a19c838574fd"
},
requestId:
 
"965e8d5cac669beb"
},
$metadata:
 
{
id:
 
"01K16NV6472RY8D9NYPFWRS3JF",
requestId:
 
"965e8d5cac669beb",
trigger:
 
"POST /v1/chat/completions",
service:
 
"gemini-cli-worker-2",
message:
 
"All tokens expired, refreshing...",
account:
 
"4d4c141be2eb9d769c8ed0e5d4609bc9",
type:
 
"cf-worker",
fingerprint:
 
"29a47e9163170a79ef8ccad48844cb8a",
origin:
 
"fetch",
messageTemplate:
 
"All tokens expired, refreshing...",
}
}
2025-07-27 19:30:36:295
UTC
Refreshing OAuth token...
Search properties by key or value
{
message:
 
"Refreshing OAuth token...",
$workers:
 
{
truncated:
 
false,
event:
 
{
request:
 
{
url:
 
"https://gemini-cli-worker-2.vallangirakesh.workers.dev/v1/chat/completions",
method:
 
"POST",
path:
 
"/v1/chat/completions"
}
},
outcome:
 
"ok",
scriptName:
 
"gemini-cli-worker-2",
eventType:
 
"fetch",
executionModel:
 
"stateless",
scriptVersion:
 
{
id:
 
"7b1634d6-6abf-487b-a4f8-a19c838574fd"
},
requestId:
 
"965e8d5cac669beb"
},
$metadata:
 
{
id:
 
"01K16NV6472RY8D9NYPFWRS3JG",
requestId:
 
"965e8d5cac669beb",
trigger:
 
"POST /v1/chat/completions",
service:
 
"gemini-cli-worker-2",
message:
 
"Refreshing OAuth token...",
account:
 
"4d4c141be2eb9d769c8ed0e5d4609bc9",
type:
 
"cf-worker",
fingerprint:
 
"29a47e9163170a79ef8ccad48844cb8a",
origin:
 
"fetch",
messageTemplate:
 
"Refreshing OAuth token...",
}
}
2025-07-27 19:30:36:401
UTC
Token refreshed successfully
Search properties by key or value
{
message:
 
"Token refreshed successfully",
$workers:
 
{
truncated:
 
false,
event:
 
{
request:
 
{
url:
 
"https://gemini-cli-worker-2.vallangirakesh.workers.dev/v1/chat/completions",
method:
 
"POST",
path:
 
"/v1/chat/completions"
}
},
outcome:
 
"ok",
scriptName:
 
"gemini-cli-worker-2",
eventType:
 
"fetch",
executionModel:
 
"stateless",
scriptVersion:
 
{
id:
 
"7b1634d6-6abf-487b-a4f8-a19c838574fd"
},
requestId:
 
"965e8d5cac669beb"
},
$metadata:
 
{
id:
 
"01K16NV67H82PXGX57FWB2HH2E",
requestId:
 
"965e8d5cac669beb",
trigger:
 
"POST /v1/chat/completions",
service:
 
"gemini-cli-worker-2",
message:
 
"Token refreshed successfully",
account:
 
"4d4c141be2eb9d769c8ed0e5d4609bc9",
type:
 
"cf-worker",
fingerprint:
 
"29a47e9163170a79ef8ccad48844cb8a",
origin:
 
"fetch",
messageTemplate:
 
"Token refreshed successfully",
}
}
2025-07-27 19:30:36:401
UTC
New token expires in 3599 seconds
Search properties by key or value
{
message:
 
"New token expires in 3599 seconds",
$workers:
 
{
truncated:
 
false,
event:
 
{
request:
 
{
url:
 
"https://gemini-cli-worker-2.vallangirakesh.workers.dev/v1/chat/completions",
method:
 
"POST",
path:
 
"/v1/chat/completions"
}
},
outcome:
 
"ok",
scriptName:
 
"gemini-cli-worker-2",
eventType:
 
"fetch",
executionModel:
 
"stateless",
scriptVersion:
 
{
id:
 
"7b1634d6-6abf-487b-a4f8-a19c838574fd"
},
requestId:
 
"965e8d5cac669beb"
},
$metadata:
 
{
id:
 
"01K16NV67H82PXGX57FWB2HH2F",
requestId:
 
"965e8d5cac669beb",
trigger:
 
"POST /v1/chat/completions",
service:
 
"gemini-cli-worker-2",
message:
 
"New token expires in 3599 seconds",
account:
 
"4d4c141be2eb9d769c8ed0e5d4609bc9",
type:
 
"cf-worker",
fingerprint:
 
"29a47e9163170a79ef8ccad48844cb8a",
origin:
 
"fetch",
messageTemplate:
 
"New token expires in 3599 seconds",
}
}
2025-07-27 19:30:37:161
UTC
Token cached in KV storage with TTL of 3299 seconds
Search properties by key or value
{
message:
 
"Token cached in KV storage with TTL of 3299 seconds",
$workers:
 
{
truncated:
 
false,
event:
 
{
request:
 
{
url:
 
"https://gemini-cli-worker-2.vallangirakesh.workers.dev/v1/chat/completions",
method:
 
"POST",
path:
 
"/v1/chat/completions"
}
},
outcome:
 
"ok",
scriptName:
 
"gemini-cli-worker-2",
eventType:
 
"fetch",
executionModel:
 
"stateless",
scriptVersion:
 
{
id:
 
"7b1634d6-6abf-487b-a4f8-a19c838574fd"
},
requestId:
 
"965e8d5cac669beb"
},
$metadata:
 
{
id:
 
"01K16NV6Z9P6ZND5CSH0RDFQ3P",
requestId:
 
"965e8d5cac669beb",
trigger:
 
"POST /v1/chat/completions",
service:
 
"gemini-cli-worker-2",
message:
 
"Token cached in KV storage with TTL of 3299 seconds",
account:
 
"4d4c141be2eb9d769c8ed0e5d4609bc9",
type:
 
"cf-worker",
fingerprint:
 
"29a47e9163170a79ef8ccad48844cb8a",
origin:
 
"fetch",
messageTemplate:
 
"Token cached in KV storage with TTL of 3299 seconds",
}
}
2025-07-27 19:30:40:707
UTC
Stream completed successfully
Search properties by key or value
{
message:
 
"Stream completed successfully",
$workers:
 
{
truncated:
 
false,
event:
 
{
request:
 
{
url:
 
"https://gemini-cli-worker-2.vallangirakesh.workers.dev/v1/chat/completions",
method:
 
"POST",
path:
 
"/v1/chat/completions"
}
},
outcome:
 
"ok",
scriptName:
 
"gemini-cli-worker-2",
eventType:
 
"fetch",
executionModel:
 
"stateless",
scriptVersion:
 
{
id:
 
"7b1634d6-6abf-487b-a4f8-a19c838574fd"
},
requestId:
 
"965e8d5cac669beb"
},
$metadata:
 
{
id:
 
"01K16NVAE3YWNZCP4DVP0JBSZP",
requestId:
 
"965e8d5cac669beb",
trigger:
 
"POST /v1/chat/completions",
service:
 
"gemini-cli-worker-2",
message:
 
"Stream completed successfully",
account:
 
"4d4c141be2eb9d769c8ed0e5d4609bc9",
type:
 
"cf-worker",
fingerprint:
 
"29a47e9163170a79ef8ccad48844cb8a",
origin:
 
"fetch",
messageTemplate:
 
"Stream completed successfully",
}
}