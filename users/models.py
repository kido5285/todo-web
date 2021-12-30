from flask import Flask, json, request, jsonify, session, redirect
from flask.wrappers import Request
from passlib.hash import pbkdf2_sha256
from pymongo import ReturnDocument
import uuid
import pymongo

client = pymongo.MongoClient('127.0.0.1', 27017)
db = client.todo_list_user_login_system

class User:
    def createsession(self, user):
        del user['password']
        del user['_id']
        session['logged_in'] = True
        session['user'] = user
        return jsonify(user), 200

    def submitsignup(self):
        user = {
            '_id': uuid.uuid4().hex,
            'username': request.form.get('username'),
            'email': request.form.get('email'),
            'password': request.form.get('password'),
            'todos': {
                'completed': [],
                'uncompleted': []
            }
        }
        user['password'] = pbkdf2_sha256.encrypt(user['password'])
        if db.users.find_one({'email': user['email']}):
            print('err')
            return jsonify({'error': 'email already exist'}), 406
        elif db.users.find_one({'username': user['username']}):
            print('err')
            return jsonify({'error': 'username already exist'}), 406
        else:
            print('suc')
            db.users.insert_one(user)
            return jsonify({'success': 'Account created successful'}), 200

    
    def submitlogin(self):
        print(request.form)
        user = {
            'email': request.form.get('email'),
            'password': request.form.get('password') 
        }
        fUser = db.users.find_one({'email': user['email']})
        if fUser:
            if pbkdf2_sha256.verify(user['password'], fUser['password']):
                self.createsession(fUser)
                return jsonify({'success': 'logged in successful'}), 200
        
        return jsonify({'error': 'login credential incorrect'}), 406
    
    def signout(self):
        session.clear()
        return jsonify({'success': 'success'}), 200

    def addItem(self):
        print(request.form, session['user']['todos']['uncompleted'])
        uncompleted = session['user']['todos']['uncompleted']
        uncompleted.append(request.form.get('descrip'))
        session['uncompleted'] = uncompleted
        print(db.users.find_one_and_update({'username': session['user']['username']}, {'$set': {'todos.uncompleted': uncompleted}}, upsert=True))
        return jsonify({'success': 'added'}), 200

    def deleteItem(self):
        fUser = db.users.find_one({'username': session['user']['username']})
        uncompleted = fUser['todos']['uncompleted']
        completed = fUser['todos']['completed']

        if request.form.get('status') == 'uncompleted':
            for i in uncompleted:
                if i == request.form.get('descrip'):
                    uncompleted.remove(i)
                    session['user']['todos']['uncompleted'] = uncompleted
                    db.users.find_one_and_update({'username': session['user']['username']}, {'$set': {'todos.uncompleted': uncompleted}}, upsert=True)
                    return jsonify({'success': 'success uncompleted'}), 200
        elif request.form.get('status') == 'completed':
            for i in completed:
                if i == request.form.get('descrip'):
                    completed.remove(i)
                    session['user']['todos']['completed'] = completed
                    db.users.find_one_and_update({'username': session['user']['username']}, {'$set': {'todos.completed': completed}}, upsert=True)
                    return jsonify({'success': 'success completed'}), 200

    def completeItem(self):
        fUser = db.users.find_one({'username': session['user']['username']})
        uncompleted = fUser['todos']['uncompleted']
        completed = fUser['todos']['completed']
        for i in uncompleted:
            if i == request.form.get('descrip'):
                uncompleted.remove(request.form.get('descrip'))
                completed.append(request.form.get('descrip'))
                db.users.find_one_and_update({'username': session['user']['username']}, {'$set': {'todos.completed': completed, 'todos.uncompleted': uncompleted}}, upsert=True)
                return jsonify({'success': 'completed item'}), 200
        return jsonify({'error': 'unsuccess'})
    
    def uncompleteItem(self):
        fUser = db.users.find_one({'username': session['user']['username']})
        uncompleted = fUser['todos']['uncompleted']
        completed = fUser['todos']['completed']
        for i in completed:
            if i == request.form.get('descrip'):
                completed.remove(request.form.get('descrip'))
                uncompleted.append(request.form.get('descrip'))
                db.users.find_one_and_update({'username': session['user']['username']}, {'$set': {'todos.completed': completed, 'todos.uncompleted': uncompleted}}, upsert=True)
                return jsonify({'success': 'uncompleted item'}), 200
        return jsonify({'success': 'uncompleted'}), 200