import { Text, View } from "react-native"
import { MenuOption } from "react-native-popup-menu"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const MenuItems = ({ text, action, value, icon }) => {
    return (
        <MenuOption onSelect={() => action(value)}>
            <View className="flex-row items-center justify-between px-4 py-2">
                <Text style={{ fontSize: hp(1.7) }} className="font-semibold text-neutral-600">{text}</Text>
                {icon}
            </View>
        </MenuOption>
    )
}