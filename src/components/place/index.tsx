import { TouchableOpacity, TouchableOpacityProps, Text, View, Image } from "react-native";
import { s } from "./styles";
import { IconTicket } from "@tabler/icons-react-native";
import { colors } from "@/styles/theme";

export type PlaceProps = {
    id: string;
    name: string;
    description: string;
    coupons: number;
    cover: string;
    address: string;
};

type Props = TouchableOpacityProps & {
    data: PlaceProps;
};

export function Place({ data, ...rest }: Props) {
    return (
        <TouchableOpacity style={s.container} {...rest} accessible={true} accessibilityLabel={data.name}>
            <Image 
                style={s.image} 
                source={{ uri: data.cover }} 
                onError={() => {
                    // Adicione um fallback, se necessário
                }}
            />

            <View style={s.content}>
                <Text style={s.name}>{data.name}</Text>
                <Text style={s.description} numberOfLines={2}>{data.description}</Text>

                <View style={s.footer}>
                    <IconTicket size={16} color={colors.red.base} />
                    <Text style={s.tickets}>{data.coupons} cupons disponíveis</Text>
                </View>    
            </View>
        </TouchableOpacity>
    );
}