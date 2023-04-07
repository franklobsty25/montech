Montech test solution

Live at: https://hungry-jay-kerchief.cyclic.app/

Routes:

GET https://hungry-jay-kerchief.cyclic.app/api/v1/users

POST https://hungry-jay-kerchief.cyclic.app/api/v1/users/signup

payload: { firstName: string, lastName: string, email: string, password: string, role: string default "author" }

POST https://hungry-jay-kerchief.cyclic.app/api/v1/users/login

payload: { email: string, password: string }

GET https://hungry-jay-kerchief.cyclic.app/api/v1/articles

GET https://hungry-jay-kerchief.cyclic.app/api/v1/articles/:articleId

POST https://hungry-jay-kerchief.cyclic.app/api/v1/articles/create

payload: { title: string, content: string }

PUT https://hungry-jay-kerchief.cyclic.app/api/v1/articles/update/:articleId

payload: { title: string, content: string }

PUT https://hungry-jay-kerchief.cyclic.app/api/v1/articles/status/:articleId

payload: { status: string }

DELETE https://hungry-jay-kerchief.cyclic.app/api/v1/articles/delete/:articleId
