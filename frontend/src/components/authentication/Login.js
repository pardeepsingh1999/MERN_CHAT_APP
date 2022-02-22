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
import { showToast } from "../../helpers";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const _submitHandler = async () => {
    if (!email || !password) {
      showToast("Please fill all the fields", "error");
      return;
    }

    try {
      setLoading(true);

      const config = {
        method: "post",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      };

      fetch("/api/user/login", config)
        .then((res) => res.json())
        .then((res) => {
          showToast("Login successfully", "success");

          localStorage.setItem("userData", JSON.stringify(res.user));

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
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          placeholder="Enter you email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
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
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={_submitHandler}
        isLoading={loading}
      >
        Login
      </Button>

      <Button
        variant="solid"
        colorScheme="red"
        width="100%"
        onClick={() => {
          console.log("work");
          setEmail("guest@example.com");
          setPassword("123456");
        }}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;
