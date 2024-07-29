import React, { useEffect, useState } from "react";
import Header from "../../../components/Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ROUTES from "../../../navigations/Routes";

function University() {
  const [form, setForm] = useState({ name: "", image: null });
  const [formError, setFormError] = useState({ name: "", image: "" });
  const [universityId, setUniversityId] = useState(null);
  const [universities, setUniversities] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    GetAll(); 
  }, []);

  const changeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  function GetAll() {
    axios.get("http://localhost:8081/university").then((d) => {
      setUniversities(d.data.univData);
    });
  }

  function SaveUniversity() {
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("image", form.image, form.image.name);
      axios
        .post("http://localhost:8081/university", formData, {
          "content-type": "multipart/form-data",
        })
        .then((d) => {
          alert(d.data.message);
          GetAll();
          ResetForm();
        })
        .catch((e) => {
          console.log("Fail to submit data !!!!");
        });
    } catch (error) {
      console.log("Fail to submit data !!!!");
    }
  }
  function UpdateUniversity() {
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("image", form.image, form.image.name);
      formData.append("id", universityId);
      axios
        .put("http://localhost:8081/university", formData, {
          "content-type": "multipart/form-data",
        })
        .then((d) => {
          alert(d.data.message);
          GetAll();
          ResetForm();
        })
        .catch((e) => {
          console.log("Fail to submit data !!!!");
        });
    } catch (error) {
      console.log("Fail to submit data !!!!");
    }
  }
  function DeleteUniversity(id) {
    try {
      let ans = window.confirm("Want to delete data ?");
      if (!ans) return;
      axios
        .delete("http://localhost:8081/university", { data: { id: id } })
        .then((d) => {
          alert(d.data.message);
          GetAll();
          ResetForm();
        })
        .catch((e) => {
          console.log("Fail to submit data !!!!");
        });
    } catch (error) {
      console.log("Fail to submit data !!!!");
    }
  }
  function OnUniversitySubmit() {
    let errors = false;
    let error = { name: "", image: "" };
    if (form.name.trim().length == 0) {
      errors = true;
      error = { ...error, name: "University Name Empty !!!" };
    }
    if (form.image == null) {
      errors = true;
      error = { ...error, image: "Please select image !!!" };
    }
    if (errors) setFormError(error);
    else {
      setFormError(error);
      universityId ? UpdateUniversity() : SaveUniversity();
    }
  }

  function ResetForm() {
    setForm({ name: "", image: null });
  }

  function RenderUniversities() {
    return universities?.map((item) => {
      return (
        <tr>
          <td>
            <img
              src={"http://localhost:8081/" + item.image}
              height="150"
              width="150"
            />
          </td>
          <td>{item.name}</td>
          <td>
            <button
              className="btn btn-primary"
              onClick={() => {
                navigate(
                  ROUTES.departmentAdmin.name +
                    "?id=" +
                    item._id +
                    "&name=" +
                    item.name
                );
              }}
            >
              Add Department
            </button>
          </td>
          <td>
            <button
              className="btn btn-danger"
              onClick={() => {
                DeleteUniversity(item._id);
              }}
            >
              Delete
            </button>
          </td>
          <td>
            <button
              className="btn btn-info"
              onClick={() => {
                setUniversityId(item._id);
                setForm({ ...form, name: item.name });
              }}
            >
              Edit
            </button>
          </td>
        </tr>
      );
    });
  }

  return (
    <div>
      <Header />
      <div className="row p-2 m-2">
        <div class="card text-center mx-auto">
          <div class="card-header bg-info text-white">
            {universityId ? "Edit University" : "New University"}
          </div>
          <div class="card-body">
            <div className="form-group row">
              <label className="col-lg-4">University Name</label>
              <div className="col-lg-8">
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Name"
                  onChange={changeHandler}
                  value={form.name}
                />
                <p className="text-danger">{formError.name}</p>
              </div>
            </div>
            <div className="form-group row">
              <label className="col-lg-4">University Image</label>
              <div className="col-lg-8">
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) => {
                    let file = e.target.files[0];
                    setForm({ ...form, image: file });
                  }}
                />
                <p className="text-danger">{formError.image}</p>
              </div>
            </div>
          </div>
          <div class="card-footer text-muted">
            {universityId ? (
              <button
                className="btn btn-info"
                onClick={() => {
                  OnUniversitySubmit();
                }}
              >
                Update
              </button>
            ) : (
              <button
                className="btn btn-info"
                onClick={() => {
                  OnUniversitySubmit();
                }}
              >
                Save
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="border m-2 p-2">
        <table className="table  table-bordered table-striped table-active">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Add Department</th>
              <th>Delete</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>{RenderUniversities()}</tbody>
        </table>
      </div>
    </div>
  );
}

export default University;
