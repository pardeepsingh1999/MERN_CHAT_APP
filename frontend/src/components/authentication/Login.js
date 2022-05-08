import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showToast } from "../../helpers";
import { login } from "../../http/http-calls";
import { addUserCredential } from "../../redux/actions/user-credential";

const Login = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const _submitHandler = async (e) => {
    if (e) e.preventDefault();

    if (!email || !password) {
      showToast("Please fill all the fields", "error");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        email,
        password,
      };

      login(payload)
        .then((res) => {
          showToast("Login successfully", "success");

          dispatch(addUserCredential({ token: res.token, user: res.user }));

          setLoading(false);

          navigate("/chats");
        })
        .catch((error) => {
          console.log("error>>", error);
          setLoading(false);

          showToast(
            error?.reason?.length
              ? error.reason
              : "Server error, Try again after sometime",
            "error"
          );
        });
    } catch (error) {
      console.log("error>>", error);
      setLoading(false);

      showToast(
        error?.reason?.length
          ? error.reason
          : "Something went wrong, Try again after sometime",
        "error"
      );
    }
  };

  return (
    <VStack spacing="5px">
      <form onSubmit={_submitHandler} style={{ width: "100%" }}>
        <FormControl id="email" isRequired p="1">
          <FormLabel>Email</FormLabel>
          <Input
            id="login-email"
            type="email"
            placeholder="Enter you email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>

        <FormControl id="password" isRequired p="1">
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter you password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button
                h="1.75rem"
                size="sm"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          width="100%"
          style={{ margin: "15px 0px 10px" }}
          isLoading={loading}
        >
          Login
        </Button>
      </form>

      <Button
        variant="solid"
        colorScheme="red"
        width="100%"
        onClick={() => {
          setEmail("guest@gmail.com");
          setPassword("qwerty");
        }}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;
