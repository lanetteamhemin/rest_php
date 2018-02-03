const mysql = require('mysql');
const validator=require('validator');
const _ = require('lodash');

var userschem.Schema({
    email:{
        type:String,
        required:true,
        trim:true,
        minlength:1
        // validate:{
        //     validator: validator.isEmail,
        //     message:'{VALUE} is not a valid email'
        // }
    },
    username:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    tokens:[{
        access:{
            type:String,
            require:true
        },
        token:{
            type:String,
            require:true
        }
    }]
});

userschema.methods.toJSON = function () {
    var u=this;
    var userobj = u.toObject();

    return _.pick(userobj,['_id','email']);
};

userschema.methods.generateAuthToken =function(){
    var u = this;
    var access = 'auth';
    var token = jwt.sign({_id:u._id.toHexString(),access},'abc123').toString();

    u.tokens.push({access,token});

    return u.save().then(()=>{
        return token;
    });
};

userschema.statics.findByToken = function(token){
    var user = this;
    var decoded ;

    //jwt.verify()
    try{
        decoded = jwt.verify(token,'abc123');
    }catch(e){
        return Promise.reject();
    }

    return user.findOne({
        '_id':decoded._id,
        'tokens.token':token,
        'tokens.access':'auth'
    });
}

var user = mongoose.model('user',userschema);

module.exports={user}