// import axios from 'axios';
import jwt_decode from 'jwt-decode';

export const createOrGetUserAndLogin = async (response, addUser) => {
    const decoded = jwt_decode(response.credential);

    const { name, picture, sub, email } = decoded;

    const user = {
        _id: sub,
        _type: 'user',
        userName: name,
        email: email,
        image: picture
    }

    const check = await fetch('http://localhost:3001/user/' + user._id)
        .then(res => res.json())

    // if check is equal to null that means that this user does not exist
    // in the database already
    // is there a situation where this wont work??
    if (check == null){
        await fetch('http://localhost:3001/user', {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        }); // add catch?
    }

    // login, addUser is in /store/Auth.js
    addUser(user); 
}