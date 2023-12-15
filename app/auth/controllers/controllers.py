from app.db import database_connection
from flask import session

def authentication(username, password):
    """
    authentication processing for login

    Args:
        username (str): account username
        password (str): account password

    Returns:
        bool: result of event
    """
    # connection to db from schema
    client, database = database_connection()
    collection = database["User"]
    
    # Convert the cursor to a list
    user_information = collection.find_one({'username': username})
    
    # parsing user and authentication
    if user_information != None and user_information['password'] == password:
        from app.auth.models.user import User
        user = User(user_information)
        cart_collection = database["User_Cart"]
        cart = cart_collection.find_one({"id": (user.__dict__())["id"]})
        cart["_id"] = str(cart["_id"])
        session["user"] = user.__dict__()
        session["cart"] = cart
        if session.get("user_features") == None:
            user_features ={
                'clothing': None,
                'brand': None,
                'style':None,
                'material': None,
                'activity': None,
                'feature': None,
                'age': None 
            }
            session["user_features"] = user_features
        client.close()
        return True
    else:
        client.close()
        return False
        
def confirm_authentication(username, email, newpass, confirm_newpass):
    """
    authentication and update password

    Args:
        username (str): username account
        email (str): user email
        newpass (str): user new password
        confirm_newpass (_type_): confirm user new password

    Returns:
        bool: result of event
    """
    if newpass == confirm_newpass:
        client, database = database_connection()
        collection = database["User"]
        
        # Find the user with the given username and email
        user_query = {'username': username, 'email': email}
        existing_user = collection.find_one(user_query)

        if existing_user:
            # Update the user's password
            update_query = {'$set': {'password': newpass}}
            collection.update_one(user_query, update_query)
            client.close()
            return True  # Password updated successfully
        else:
            client.close()
            return False  # User not found

def register_user(username, email, password, user_id , gender, role):
    """
    register new user

    Args:
        username (str): username account
        email (str): user email
        password (str): user password
        user_id (str): id
        gender (M/F): Male or Female

    Returns:
        bool: result of event 
    """
    client, database = database_connection()
    collection = database["User"]
    cart_collection = database["User_Cart"] 
    image_collection = database["User_Image"]
    contact_colleciton = database["User_Contact"]
    
    # Check if the username or email is already registered
    existing_user = collection.find_one({'$or': [{'username': username}, {'email': email}, {'id': user_id}]})

    if existing_user:
        # Username or email is already taken
        client.close()
        return False
    else:
        # Register the new user
        new_user = {
            'username': username,
            'password': password,
            'email': email,
            'gender': gender,
            'id': user_id,
            'role': role
        }
        
        new_cart = {
            'id': user_id,
            'cart': []
        }
        
        new_image = {
            'id': user_id,
            'image' : ""
        }
        
        new_contact = {
            'id': user_id,
            'phone': None,
            'address': None,
        }
        
        collection.insert_one(new_user)
        cart_collection.insert_one(new_cart)
        image_collection.insert_one(new_image)
        contact_colleciton.insert_one(new_contact)
        client.close()
        return True  
    # Registration successful
    