import {
  Button,
  ButtonGroup,
  Flex,
  Image,
  Switch,
  TextField,
  View,
} from "@adobe/react-spectrum";
import React from "react";
import LayoutCentratoAlloSchermo from "../../Layouts/LayoutCentratoAlloSchermo";

function Login() {
  return (
    <LayoutCentratoAlloSchermo>
      <View borderWidth="thin" borderColor="dark" borderRadius="medium">
        <Flex height={"50vh"} width={"70vw"}>
          <View flex={1}>
            <Flex width={"100%"} height={"100%"}>
              <Image
                src="https://i.imgur.com/Z7AzH2c.png"
                alt="Sky and roof"
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
                />
                <TextField
                  isRequired
                  flex={1}
                  label="Password"
                  type={"password"}
                  width={"100%"}
                />
                <Switch flex={1}>Ricordami al prossimo accesso</Switch>
              </Flex>
              <ButtonGroup>
                <Button variant="primary">Recupera Password</Button>
                <Button variant="accent">Accedi</Button>
              </ButtonGroup>
            </Flex>
          </View>
        </Flex>
      </View>
    </LayoutCentratoAlloSchermo>
  );
}

export default Login;
