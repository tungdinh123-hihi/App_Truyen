import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';

const MosaicSection = ({ superTitle, title, data }) => {
  return (
    <View style={styles.section}>
      {superTitle && <Text style={styles.superTitle}>{superTitle}</Text>}
      <Text style={styles.sectionTitle}>{title}</Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.mosaicScroll}>
        <TouchableOpacity activeOpacity={0.8}>
          <Image source={{ uri: data[0] }} style={styles.largeCover} />
        </TouchableOpacity>

        <View style={styles.column}>
          <TouchableOpacity activeOpacity={0.8}><Image source={{ uri: data[1] }} style={styles.smallCover} /></TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8}><Image source={{ uri: data[2] }} style={styles.smallCover} /></TouchableOpacity>
        </View>

        <View style={styles.column}>
          <TouchableOpacity activeOpacity={0.8}><Image source={{ uri: data[3] }} style={styles.smallCover} /></TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8}><Image source={{ uri: data[4] }} style={styles.smallCover} /></TouchableOpacity>
        </View>

         <TouchableOpacity activeOpacity={0.8}>
          <Image source={{ uri: data[5] }} style={styles.largeCover} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: 24,
  },
  superTitle: {
    color: '#A0A0A0',
    fontSize: 13,
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  mosaicScroll: {
    paddingLeft: 16,
    paddingRight: 8,
    gap: 10,
  },
  largeCover: {
    width: 150,
    height: 250,
    borderRadius: 8,
    backgroundColor: '#333',
    marginRight: 10,
  },
  column: {
    justifyContent: 'space-between',
    height: 250,
    marginRight: 10,
  },
  smallCover: {
    width: 110,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#333',
  },
});

export default MosaicSection;