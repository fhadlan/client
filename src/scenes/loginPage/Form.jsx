import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  RadioGroup,
  Radio,
  FormControl,
  FormControlLabel,
  FormLabel,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import { Formik } from "formik"; //module untuk buat form
import * as yup from "yup"; //module validasi
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";

/**SCHEMA AND VALIDATION */
const registerSchema = yup.object().shape({
  firstName: yup.string().required("Field harus diisi"),
  lastName: yup.string().required("Field harus diisi"),
  gender: yup.string().required("Field harus diisi"),
  email: yup
    .string()
    .email("Masukkan email yang benar")
    .required("Field harus diisi")
    .test("Unique email", "Email sudah digunakan", async (value) => {
      const cek = await fetch("http://localhost:3001/api/v1/auth/cek", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      });
      const response = await cek.json();
      return response.cek === null ? true : false;
    }),
  password: yup
    .string()
    .required("Field harus diisi")
    .min(8, "Password harus 8 karakter atau lebih"),
});

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Masukkan email yang benar")
    .required("Silahkan isi email"),
  password: yup.string().required("Silahkan isi password"),
});

/**INITIAL VALUE FOR FORMIK */
const initialValueRegister = {
  firstName: "",
  lastName: "",
  gender: "",
  email: "",
  password: "",
};

const initialValueLogin = {
  email: "",
  password: "",
};

/**FORM FUNCTION */
const Form = () => {
  const [pageType, setPageType] = useState("register");
  const { palette } = useTheme();
  const dispatch = useDispatch(); //UNTUK MENGGUNAKAN FUCNTION DI FOLDER STATE INDEX.JS
  const navigate = useNavigate(); //UNTUK NAVIGASI LINK
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  /**FORM FUNCTION */
  const register = async (values, onSubmitProps) => {
    const registerRes = await fetch(
      "http://localhost:3001/api/v1/auth/register",
      {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      }
    );
    const registered = await registerRes.json();
    onSubmitProps.resetForm();
    if (registered) {
      setPageType("login");
    }
  };

  const login = async (values, onSubmitProps) => {
    const loggedInRes = await fetch("http://localhost:3001/api/v1/auth/login", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const loggedIn = await loggedInRes.json();
    onSubmitProps.resetForm();
    if (loggedIn) {
      dispatch(
        setLogin({
          user: loggedIn.user,
          token: loggedIn.token,
        })
      );
      navigate("/home");
    }
  };
  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValueLogin : initialValueRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
      validateOnChange={false}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4,minmax(0,1fr))"
            sx={{
              "& > div ": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            {/**CEK STATE JIKA REGISTER */}
            {isRegister && (
              <>
                <TextField
                  label="First Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  name="firstName"
                  error={
                    Boolean(touched.firstName) && Boolean(errors.firstName)
                  }
                  helperText={touched.firstName && errors.firstName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Last Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  name="lastName"
                  error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ gridColumn: "span 2" }}
                />
                <FormControl sx={{ gridColumn: "span 4" }}>
                  <FormLabel id="gender">Jenis Kelamin</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="gender"
                    name="gender"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.gender) && Boolean(errors.gender)}
                    helperText={touched.gender && errors.gender}
                  >
                    <FormControlLabel
                      value="female"
                      control={<Radio />}
                      label="Perempuan"
                    />
                    <FormControlLabel
                      value="male"
                      control={<Radio />}
                      label="Laki-laki"
                    />
                  </RadioGroup>
                </FormControl>
              </>
            )}
            <TextField
              label="Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name="email"
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              label="Password"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 4" }}
            />
          </Box>
          {/**SUBMIT BUTTON */}
          <Box>
            <Button
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: "white",
                "&:hover": { color: palette.primary.main },
              }}
            >
              {isLogin ? "Login" : "Daftar"}
            </Button>
            <Typography
              onClick={() => {
                setPageType(isLogin ? "register" : "login");
                resetForm();
              }}
              sx={{
                textDecoration: "underline",
                color: palette.primary.main,
                "&:hover": {
                  cursor: "pointer",
                  color: palette.primary.light,
                },
              }}
            >
              {isLogin
                ? "Belum punya akun? daftar disini"
                : "Sudah punya akun, login disini"}
            </Typography>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;
