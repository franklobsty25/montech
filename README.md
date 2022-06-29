Montech test solution

Live at: https://montech-test.herokuapp.com/

Routes:

GET https://montech-test.herokuapp.com/api/v1/users

POST https://montech-test.herokuapp.com/api/v1/users/signup

payload: { firstName: string, lastName: string, email: string, password: string, role: string default "author" }

POST https://montech-test.herokuapp.com/api/v1/users/login

payload: { email: string, password: string }

GET https://montech-test.herokuapp.com/api/v1/articles

GET https://montech-test.herokuapp.com/api/v1/articles/:articleId

POST https://montech-test.herokuapp.com/api/v1/articles/create

payload: { title: string, content: string }

PUT https://montech-test.herokuapp.com/api/v1/articles/update/:articleId

payload: { title: string, content: string }

PUT https://montech-test.herokuapp.com/api/v1/articles/status/:articleId

payload: { status: string }

DELETE https://montech-test.herokuapp.com/api/v1/articles/delete/:articleId
