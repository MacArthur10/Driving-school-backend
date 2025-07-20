const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('./data/admin'); // Changed from users to admin

// TODO: Replace with your actual MongoDB connection string and database name
mongoose.connect('mongodb+srv://belmacarthur:Codeislife237@cluster0.hhprgtw.mongodb.net/quiz', { useNewUrlParser: true, useUnifiedTopology: true });

async function createSuperAdmin() {
  const email = 'bel10@gmail.com';
  const password = '123456'; // Change to your desired password

  // TODO: Replace with a valid centre ObjectId from your database
  const centreId = '68796ebc2fc0a122107c7fbe';

  const superadmin = new Admin({
    name: 'Super Admin1',
    email,
    Tel: '0000000000',
    Country: 'YourCountry',
    City: 'YourCity',
    password: password, // Let the pre-save hook hash it
    centre: centreId,
    role: 'superadmin'
  });

  await superadmin.save();
  console.log('Superadmin created in admin collection:', email, password);
  mongoose.disconnect();
}

createSuperAdmin(); 