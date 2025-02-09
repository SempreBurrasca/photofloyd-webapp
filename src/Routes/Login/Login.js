import React, { useState } from "react";
import {
  Button,
  ButtonGroup,
  Flex,
  Image,
  Switch,
  TextField,
  View,
} from "@adobe/react-spectrum";
import {
  getAuth,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { useNavigate, redirect } from "react-router-dom";
import LayoutCentratoAlloSchermo from "../../Layouts/LayoutCentratoAlloSchermo";
import { ToastQueue } from "@react-spectrum/toast";
import logo from "../../logo.png"
function Login(props) {
  const navigate = useNavigate();
  const [credenziali, setCredenziali] = useState({
    email: "",
    password: "",
    ricordami: false,
  });

  //funzione di autenticazione
  let autenticaUtente = () => {
    const auth = getAuth();
    if (credenziali.ricordami) {
      setPersistence(auth, browserLocalPersistence);
    } else {
      setPersistence(auth, browserSessionPersistence);
    }
    signInWithEmailAndPassword(auth, credenziali.email, credenziali.password)
      .then((userCredential) => {
        // Loggato
        const user = userCredential.user;
        console.log(user);
        navigate("/");
        ToastQueue.positive("Login effettuato con successo", { timeout: 5000 });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        return ToastQueue.positive(
          "Ops! C'è stato un errore con il tuo login: "
        );
        console.log(error,error.message);
        ToastQueue.negative(error.message, { timeout: 5000 })
        
      });
  };

  return (
    <LayoutCentratoAlloSchermo>
      <View borderWidth="thin" borderColor="dark" borderRadius="medium">
        <Flex height={"50vh"} width={"70vw"}>
          <View flex={1}>
            <Flex width={"100%"} height={"100%"}>
              <Image
                src={logo}
                alt="Logo di Photofloyd"
                objectFit="cover"
              />
            </Flex>
          </View>
          <View flex={1}>
            <Flex
              height={"100%"}
              direction="column"
              alignItems={"center"}
              justifyContent={"space-evenly"}
              gap="size-350"
            >
              <h1>Login</h1>
              <Flex
                direction="column"
                alignItems={"start"}
                gap="size-150"
                width={"70%"}
              >
                <TextField
                  isRequired
                  flex={1}
                  label="E-mail"
                  type="email"
                  width={"100%"}
                  value={credenziali.email}
                  onChange={(e) => setCredenziali({ ...credenziali, email: e })}
                />
                <TextField
                  isRequired
                  flex={1}
                  label="Password"
                  type={"password"}
                  width={"100%"}
                  value={credenziali.password}
                  onChange={(e) =>
                    setCredenziali({ ...credenziali, password: e })
                  }
                />
                <Switch
                  flex={1}
                  value={credenziali.ricordami}
                  onChange={(e) =>
                    setCredenziali({ ...credenziali, ricordami: e })
                  }
                >
                  Ricordami al prossimo accesso
                </Switch>
              </Flex>
              <ButtonGroup>
                <Button
                  variant="primary"
                  onPress={() =>
                    ToastQueue.positive("Login effettuato con successo", {
                      timeout: 5000,
                    })
                  }
                >
                  Recupera Password
                </Button>
                <Button variant="accent" onPress={autenticaUtente}>
                  Accedi
                </Button>
              </ButtonGroup>
            </Flex>
          </View>
        </Flex>
      </View>
    </LayoutCentratoAlloSchermo>
  );
}

export default Login;
