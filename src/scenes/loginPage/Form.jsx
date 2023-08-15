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
  MenuItem,
} from "@mui/material";
import EditOutLinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik"; //module untuk buat form
import * as yup from "yup"; //module validasi
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import Dropzone from "react-dropzone"; //module untuk upload foto/file
import FlexBetween from "components/FlexBetween";

const registerSchema = yup.object().shape({
  firstName: yup.string().required("Field harus diisi"),
  lastName: yup.string().required("Field harus diisi"),
  gender: yup.string().required("Field harus diisi"),
  email: yup
    .string()
    .email("Masukkan email yang benar")
    .required("Field harus diisi"),
  password: yup.string().required("Field harus diisi"),
});

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Masukkan email yang benar")
    .required("Silahkan isi email"),
  password: yup.string().required("Silahkan isi password"),
});

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

const Form = () => {
  const [pageType, setPageType] = useState("register");
  const { palette } = useTheme();
  const dispatch = useDispatch(); //UNTUK MENGGUNAKAN FUCNTION DI FOLDER STATE INDEX.JS
  const navigate = useNavigate(); //UNTUK NAVIGASI LINK
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  const handleFormSubmit = async (values, onSubmitProps) => {};

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValueLogin : initialValueRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
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
                <FormControl>
                  <FormLabel id="gender">Jenis Kelamin</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="gender"
                    defaultValue="female"
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
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  error={Boolean(touched.password) && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  sx={{ gridColumn: "span 4" }}
                />
              </>
            )}
            form submit disini
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;
