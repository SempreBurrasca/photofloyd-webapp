import React from "react";
import {
  ActionButton,
  ActionGroup,
  Flex,
  Item,
  Menu,
  MenuTrigger,
  TabList,
  Tabs,
  View,
} from "@adobe/react-spectrum";
import { Avatar } from "@react-spectrum/avatar";
import { useNavigate } from "react-router-dom";
import ChevronLeft from "@spectrum-icons/workflow/ChevronLeft";

function HeaderSezioneInterna(props) {
  const navigate = useNavigate();
  return (
    <Flex minHeight="size-675" justifyContent="start" alignItems={"start"}>
      <View
        flex={1}
        paddingTop="size-200"
        paddingBottom="size-200"
        paddingStart="size-800"
      >
        <Flex justifyContent="start" alignItems={"start"}>
          <ActionButton isQuiet onPress={()=>navigate(-1)}>
            <ChevronLeft />
            Ritorna alla Dashboard
          </ActionButton>
        </Flex>
      </View>
    </Flex>
  );
}

export default HeaderSezioneInterna;
