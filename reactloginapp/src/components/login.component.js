import React, { Component } from "react";

export default class Login extends Component {
    constructor(props)
    {
        super(props);
        this.state={
            lid:null,
            name:null,
            login:false,
            store:null
        }
    }
    handleSubmit = async e =>
    {
        fetch('http://localhost:3000/login',{
            method:"POST",
            body:JSON.stringify(this.state)
        }).then((response)=>{
            response.json().then((result)=>{
                console.warn("result",result);
                localStorage.setItem('login',JSON.stringify({
                    login:true,
                    token:result.token
                }))
                this.setState({login:true})
            })
        })
    }
    render() {
        return (
                    <div> <h3>Login In</h3>
                    <div className="form-group">
                        <input type="text" className="form-control" placeholder="Id" name="lid" />
                    </div>
                    <div className="form-group">
                        <input type="text" className="form-control" placeholder="Name" name="lname" />
                    </div>
                    <button type="submit"  className="btn btn-primary btn-block">Login</button>
                    </div>
                    
                );
    }
}
