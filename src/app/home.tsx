import { useEffect, useState } from "react";
import { View, Alert, Text } from "react-native";
import MapView, { Callout, Marker } from "react-native-maps";
import * as Location from "expo-location";
import { router } from "expo-router";

import { api } from "@/services/api";
import { colors, fontFamily } from "@/styles/theme";

import { Categories, CategoriesProps } from "@/components/categories";
import { PlaceProps } from "@/components/place";
import { Places } from "@/components/places";


type MarketsProps = PlaceProps & {
    latitude: number
    longitude: number
}

const currentLocation ={
    latitude: -23.561187293883442,
    longitude: -46.656451388116494
}

export default function Home() {
    const [categories, setCategories] = useState<CategoriesProps>([]);
    const [category, setCategory] = useState("");

    const [markets, setMarkets] = useState<MarketsProps[]>([]);

    async function fetchCategories() {
        try {
            const { data } = await api.get("/categories");
            setCategories(data);
            setCategory(data[0].id);
        } catch (error) {
            console.log(error);
            Alert.alert("Categorias", "Erro ao buscar categorias");
        }
    }

    async function fetchPlaces() {
        try {
            if (!category) return;
            const { data } = await api.get("/markets/category/" + category);
            setMarkets(data);
        } catch (error) {
            console.log(error);
            Alert.alert("Locais", "Erro ao buscar locais");
        }

    }

    async function getLocation() {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permissão de localização", "É necessário permitir o acesso a localização");
            return;
        }

        const location = await Location.getCurrentPositionAsync({});
        console.log(location);
    }


    useEffect(() => {
        getLocation();
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchPlaces();
    }, [category]);

    return (
        <View style={{ flex: 1, backgroundColor: "#cecece" }}>
            <Categories data={categories} onSelect={setCategory} selected={category} />
            <MapView
                style={{ flex: 1 }}
                initialRegion={{
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01
                }}
                 >
                    <Marker
                        identifier="current"
                        coordinate={{
                            latitude: currentLocation.latitude,
                            longitude: currentLocation.longitude
                        }}
                        image={require("@/assets/location.png")} />

                        {
                            markets.map(( item ) => (
                                <Marker
                                    key={item.id}
                                    identifier={item.id}
                                    coordinate={{
                                        latitude: item.latitude,
                                        longitude: item.longitude
                                    }}
                                    image={require("@/assets/pin.png")} >

                                        <Callout onPress={() => router.navigate(`/market/${item.id}`)}>
                                            <View>
                                                <Text style={{fontSize: 14, color: colors.gray[600], fontFamily: fontFamily.medium }}>{item.name}</Text>
                                                
                                                <Text style={{fontSize: 14, color: colors.gray[600], fontFamily: fontFamily.medium }}>{item.address}</Text>
                                            </View>
                                        </Callout>
                                    </Marker>
                            ))
                        }
                 </MapView>
            <Places data={markets} />
        </View>
    )
}