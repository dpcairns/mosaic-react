import request from 'superagent';

    export async function getRandomColor() {
        const generateHex = Math.floor(Math.random()*16777215).toString(16);
        return await request.get(`https://www.thecolorapi.com/id?hex=${generateHex}`);
    }

    export async function getScheme(hex, mode) {
      const cleanHex = hex.slice(1)
      const schemeData = await request.get(`https://www.thecolorapi.com/scheme?hex=${cleanHex}&mode=${mode}&count=6`);
      return schemeData.body.colors.map(color => color.hex.value)
    }

    const URL = 'https://mosaic-node-db.herokuapp.com/api'

    export async function signin(user) {
      return await request.post(`${URL}/auth/signin`, user)
    }
    export async function signup(user) {
      return await request.post(`${URL}/auth/signup`, user)
    }
    export async function saveBoard(stateObject, user) {
      return await request.post(`${URL}/user/saved`, stateObject).set('Authorization', user.token)
    }
    export async function updateBoard(stateObject, user, id) {
      return await request.put(`${URL}/user/saved/${id}`, stateObject).set('Authorization', user.token)
    }
    export async function getBoards(user) {

      return await request.get(`${URL}/user/saved`).set('Authorization', user.token)
    }
    export async function deleteBoard(id, user) {
      return await request.delete(`${URL}/user/saved/${id}`).set('Authorization', user.token)
    }






