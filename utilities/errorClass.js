class ExpressError extends Error {
    constructor(messsage,status){
        super();
        this.message=messsage;
        this.status=status;
    }
}

module.exports=ExpressError;