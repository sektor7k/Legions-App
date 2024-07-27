import axios from "axios";

export default async function getUserDetail(){


    try {
        const response = await axios.get('/api/user/getuser');

    
    return response.data.user;

    } catch (error) {
        console.log(error)
    }



}