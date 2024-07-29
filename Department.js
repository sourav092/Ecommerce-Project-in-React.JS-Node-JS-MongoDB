import React, { useEffect, useState } from "react";
import Header from "../../../components/Header";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import ROUTES from "../../../navigations/Routes";

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function Department() {
  const queryParam = useQuery();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    image: null,
    universityId: queryParam.get("id"),
  });
  const [formError, setFormError] = useState({
    name: "",
    image: "",
  });
  const [departmentId, setDepartmentId] = useState(null);
  const [departments, setDepartments] = useState(null);

  useEffect(() => {
    getDepartmentsByUniversityId();
  }, []);

  const changeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  function getDepartmentsByUniversityId() {
    try {
      axios
        .get(
          "http://localhost:8081/department?universityId=" +
            queryParam.get("id")
        )
        .then((d) => {
          setDepartments(d.data.depData);
        })
        .catch((e) => {
          console.log("Fail to submit data !!!!");
        });
    } catch (error) {
      console.log("Fail to submit data !!!!");
    }
  }

  function saveDepartment() {
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("image", form.image, form.image.name);
      formData.append("universityId", queryParam.get("id"));
      axios
        .post("http://localhost:8081/department", formData, {
          "content-type": "multipart/form-data",
        })
        .then((d) => {
          alert(d.data.message);
          getDepartmentsByUniversityId();
          resetForm();
        })
        .catch((e) => {
          console.log("Fail to submit data !!!!");
        });
    } catch (error) {
      console.log("Fail to submit data !!!!");
    }
  }

  function resetForm() {
    setForm({ name: "", image: null });
  }
  function updateDepartment() {
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("image", form.image, form.image.name);
      formData.append("universityId", queryParam.get("id"));
      formData.append("id", departmentId);
      axios
        .put("http://localhost:8081/department", formData, {
          "content-type": "multipart/form-data",
        })
        .then((d) => {
          alert(d.data.message);
          getDepartmentsByUniversityId();
          resetForm();
        })
        .catch((e) => {
          console.log("Fail to submit data !!!!");
        });
    } catch (error) {
      console.log("Fail to submit data !!!!");
    }
  }
  function deleteDepartment(id) {
    try {
      axios
        .delete("http://localhost:8081/department", { data: { id: id } })
        .then((d) => {
          alert(d.data.message);
          getDepartmentsByUniversityId();
          // resetForm();
        })
        .catch((e) => {
          console.log("Fail to submit data !!!!");
        });
    } catch (error) {
      console.log("Fail to submit data !!!!");
    }
  }

  function onDepartmentSubmit() {
    let errors = false;
    let error = { name: "", image: "" };
    if (form.name.trim().length == 0) {
      errors = true;
      error = { ...error, name: "Department Name Empty !!!!" };
    }
    if (form.image == null) {
      errors = true;
      error = { ...error, image: "Pl select image !!!" };
    }
    if (errors) setFormError(error);
    else {
      setFormError(error);
      departmentId ? updateDepartment() : saveDepartment();
    }
  }
  function renderDetartments() {
    return departments?.map((item) => {
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
                  ROUTES.productAdmin.name +
                    "?id=" +
                    item._id +
                    "&name=" +
                    item.name
                );
              }}
            >
              Add Product
            </button>
          </td>
          <td>
            <button
              className="btn btn-danger"
              onClick={() => {
                deleteDepartment(item._id);
              }}
            >
              Delete
            </button>
          </td>
          <td>
            <button
              className="btn btn-info"
              onClick={() => {
                setDepartmentId(item._id);
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
            {departmentId ? "Edit Department" : "New Department"}
          </div>
          <div class="card-body">
            <div className="form-group row">
              <label className="col-lg-4">University Name</label>
              <div className="col-lg-8">
                <input
                  type="text"
                  value={queryParam.get("name")}
                  disabled
                  className="form-control"
                />
              </div>
            </div>
            <div className="form-group row">
              <label className="col-lg-4">Department Name</label>
              <div className="col-lg-8">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  className="form-control"
                  onChange={changeHandler}
                  value={form.name}
                />
                <p className="text-danger">{formError.name}</p>
              </div>
            </div>
            <div className="form-group row">
              <label className="col-lg-4">Department Image</label>
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
            <button
              className="btn btn-info"
              onClick={() => {
                onDepartmentSubmit();
              }}
            >
              {departmentId ? "Update" : "Save"}
            </button>
          </div>
        </div>
      </div>
      <div className="border p-2 m-2">
        <table className="table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Add Product</th>
              <th>Delete</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>{renderDetartments()}</tbody>
        </table>
      </div>
    </div>
  );
}

export default Department;
