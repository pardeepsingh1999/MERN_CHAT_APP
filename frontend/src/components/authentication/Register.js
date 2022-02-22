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

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const _uploadAvatar = (file) => {
    setLoading(true);

    if (!file) {
      showToast("Please select an image", "error");
      return;
    }

    if (file.type === "image/jpeg" || file.type === "image/png") {
      const data = new FormData();
      const cloudName = "dlwhuhzzp";
      data.append("file", file);
      data.append("upload_preset", "MERN_CHAT_APP");
      data.append("folder", "MERN_CHAT_APP");
      data.append("cloud_name", cloudName);
      fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((res) => {
          setAvatar(res.url.toString());
          setLoading(false);
        })
        .catch((error) => {
          console.log("error>>", error);
          setLoading(false);
        });
    } else {
      showToast("Please select an image", "error");
      setLoading(false);
      return;
    }
  };

  const _submitHandler = async () => {
    if (!name || !email || !password) {
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
        body: JSON.stringify({ name, email, password, avatar }),
      };

      fetch("/api/user/register", config)
        .then((res) => res.json())
        .then((res) => {
          showToast("Registered successfully", "success");

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
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          type="text"
          placeholder="Enter you name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>

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

      <FormControl id="avatar">
        <FormLabel>Upload your profile picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => _uploadAvatar(e.target.files[0])}
        />
      </FormControl>

      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={_submitHandler}
        isLoading={loading}
      >
        Register
      </Button>
    </VStack>
  );
};

export default Register;
