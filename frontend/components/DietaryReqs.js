import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Modal } from 'react-native';
import { getRules, getUser, setIsRuleEnabled } from '../lib/api';

export default function DietaryReqs({isFilterVisible, setFilterVisible}) {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [filters, setFilters] = useState([]);

  const toggleFilter = async (filter) => {
    console.log(filter)
    console.log(selectedFilters)
    if (selectedFilters.some(selFilter => selFilter === filter.id)) {
      setSelectedFilters(selectedFilters.filter((item) => item !== filter.id));

      const response = await setIsRuleEnabled(filter.id, true);
      if (!response || response.success === false) {
        console.error("Error: setIsRuleEnabled " + response.success);
      }
    } else {
      setSelectedFilters([...selectedFilters, filter.id]);

      const response = await setIsRuleEnabled(filter.id, false);
      if (!response || response.success === false) {
        console.error("Error: setIsRuleEnabled " + response.success);
      }
    }
  };

  useEffect(() => {
    fetchUserFilters();
  }, [])

  //get filters from backend
  const fetchUserFilters = async () => {
    try {
      const fRules = await getRules();
      const fUser = await getUser()

      if (fUser && fUser.success) {
        setSelectedFilters(fUser.data.rules);
      } else {
        console.error("Error: Fetch rules in DietaryReqs.")
        setSelectedFilters([]);
      }
  
      if (fRules && fRules.success) {
        setFilters(fRules.data);
      } else {
        console.error("Error: Fetch recipe in DietaryReqs.")
        setFilters([]);
      }
    } catch (error) {
      console.error("Error fetching rules:", error);
    }
  }

  return (
    <Modal
        visible={isFilterVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {setFilterVisible(false)}}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Filters</Text>
            <ScrollView style={styles.scrollViewModal}>
              {filters.map((filter, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.filterButton,
                    selectedFilters.some(selFilter => selFilter === filter.id) && styles.filterButtonActive,
                  ]}
                  onPress={() => toggleFilter(filter)}
                >
                  <Text
                    style={[
                      styles.filterText,
                      selectedFilters.some(selFilter => selFilter === filter.id) && styles.filterTextActive,
                    ]}
                  >
                    {filter.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => {setFilterVisible(false)}}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
  );
}

const styles = StyleSheet.create({
  filterButton: {
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4, // Android shadows
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#148B4E',
  },
  filterText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  filterTextActive: {
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: 300,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scrollViewModal: {
    maxHeight: 300,
    width: '100%',
  },
  modalCloseButton: {
    backgroundColor: '#148B4E',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 5,
  },
  modalCloseButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
});