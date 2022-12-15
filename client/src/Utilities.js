// external imports
import jwt_decode from 'jwt-decode';

export const createOrGetUserAndLogin = async (response, addUser) => {
    // use jwt_decode to decode the information returned from google
    const decoded = jwt_decode(response.credential);

    // deconstruct the decoded information
    const { name, picture, sub, email } = decoded;

    // make user equal to all information returned from google
    let user = {
        _id: sub,
        _type: 'user',
        userName: name,
        email: email,
        image: picture
    }

    // if the user already exists then this we will find out here
    const check = await fetch('/user/' + user._id)
        .then(res => res.json())

    // if check is equal to null that means that this user does not exist
    // in our database already so create a user
    if (check == null){
        await fetch('/user/', {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        }); // add catch?
    } else { // if the fetch returned a user then set user equal to the returned user from line 21
        user = check;
    }

    // call addUser with the user (either returned from google if new, or return from database if already a user)
    addUser(user); 
}