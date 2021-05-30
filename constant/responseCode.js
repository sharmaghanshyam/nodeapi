/**
   * @recordSuccessResponse
   *  @recordNotFoundResponse
   *  @errorResponse for common function of use response to the Client side directly
   **/
 const message = {
    msg200 : "Record inserted successfully",
    noRecord : "Records not found",
    recordfound : "Records found",
    requiredParamsMissing : "Required params missing",
    errorResponse : "Something went wrong!",
    deleteRecord : "Record deleted successfully",
    updateRecord : "Record updated successfully",
    notupdatedRecord : "Record not updated",
    }
 
   module.exports = {
 
      recordSuccessResponse: function(res, msg, data = [], custom_message='') {
       if(custom_message != '')
       {
         res.send({status : 1,message :custom_message, data : data});
       } 
       else
       {
         res.send({status : 1,message : message[msg], data : data});
       }
     },
     CustomResponse: function(res, status='', msg, data =[], other = []) {
       res.send({status : status,message :msg , data : data, other : other});
     },
     errorResponse: function(res, error, msg) {
       res.send({ status : 0, message : message[msg], error : error });
     }
    
 
 
   };