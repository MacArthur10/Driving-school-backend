const mongoose=require('mongoose');
const{Schema,model}=mongoose;
const bcrypt=require("bcrypt");
const userSchema=new Schema({
    name:{type:String,require:true, unique:true},
    email:{type:String,require:true,unique:true},
    Tel:{type:String,require:true,unique:true},
    Country:{type:String,require:true},
    City:{type:String,require:true},
    image:{type:String},
    password:{type:String,require:true},
    lastLogin: { type: Date, default: Date.now },
    subscription: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' },
    profileImage: { type: String, default: null }, // Ajoutez ce champ
    lastLogin: { type: Date, default: Date.now }, // Pour suivre la dernière connexion
    createdAt: { type: Date, default: Date.now },
    centre: { type: mongoose.Schema.Types.ObjectId, ref: 'Centre', required: true },
    role: { type: String, enum: ['superadmin', 'admin', 'user'], default: 'user' },
    identifiantUnique: { type: String, unique: true, required: true }
})
//HAcher le mot de pass avant de le sauvegarder
userSchema.pre('save',async function(next){
    if (this.isNew) {
        // Génère un identifiant du type CENTRECODE-XXXXXX
        const centreCode = this.centre ? String(this.centre).slice(-4).toUpperCase() : 'CENTRE';
        const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
        this.identifiantUnique = `${centreCode}-${randomPart}`;
    }
    if(this.isModified('password')|| this.isNew){
        const salt=await bcrypt.genSalt(10);
        this.password=await bcrypt.hash(this.password, salt);
    }
    next();
});
const User=model('User',userSchema);
module.exports=User;