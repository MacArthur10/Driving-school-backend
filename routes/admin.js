console.log('Loaded admin router');
const express=require('express');
const router=express.Router();
const userSController=require('../controllers/admin');
// Add /test route before /:id
router.get('/test', (req, res) => {
  res.json({ message: 'Admin test route works!' });
});
//Creer un utilisateur
router.post('/register', userSController.create);
//Se connecter
router.post('/login', userSController.login);
//Afficher tous les utilisateurs
router.get('/', userSController.list);
//Afficher un utilisateur en particulier
router.get('/:id', userSController.read);
//Modifier un utilisateur
router.put('/:id/update', userSController.update);
//Supprimer un utilisateur
router.delete('/:id/delete', userSController.remove);
console.log('Registered admin routes:');
router.stack.forEach(r => {
  if (r.route && r.route.path) {
    console.log(r.route.stack[0].method.toUpperCase(), '/api/admin' + r.route.path);
  }
});
module.exports = router;