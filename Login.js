import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import axios from "axios";
import ROUTES from "../../navigations/Routes";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [formError, setFormError] = useState({
    email: "",
    password: "",
  });

  const changeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  function onLoginRequest() {
    try {
      axios
        .post("http://localhost:8081/login", form)
        .then((d) => {
          localStorage.setItem("id", d.data.id);
          localStorage.setItem("role", d.data.role);
          if (d.data.role == "admin") navigate(ROUTES.universityAdmin.name);
          else navigate(ROUTES.home.name);
        })
        .catch((e) => {
          alert("Wrong user / pwd");
          setForm({ email: "", password: "" });
        });
    } catch (error) {
      console.log("Fail to submit data");
    }
  }

  return (
    <div>
      <Header />
      <div className="row m-2 p-2">
        <div class="card text-center mx-auto">
          <div class="card-header bg-info text-white">Login</div>
          <div class="card-body">
            <div className="form-group row">
              <label className="col-4">UserName</label>
              <div className="col-8">
                <input
                  type="text"
                  name="email"
                  onChange={changeHandler}
                  className="form-control"
                  value={form.email}
                />
                <p className="text-danger">{formError.email}</p>
              </div>
            </div>
            <div className="form-group row">
              <label className="col-4">Password</label>
              <div className="col-8">
                <input
                  type="password"
                  name="password"
                  onChange={changeHandler}
                  className="form-control"
                  value={form.password}
                />
                <p className="text-danger">{formError.password}</p>
              </div>
            </div>
          </div>
          <div class="card-footer text-muted">
            <button
              className="btn btn-info"
              onClick={() => {
                onLoginRequest();
              }}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
