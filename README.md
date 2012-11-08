node-googlecontacts
===================

````
npm install googlecontacts
````

Usage
=====
```javascript
var credentials = {
  email: 'me@mysite.com',
  password: 'mypassword'
};

var contacts = new googleContacts(credentials)

contacts.on('contactsReceived', function(contacts){
    console.log(contacts)
});
```