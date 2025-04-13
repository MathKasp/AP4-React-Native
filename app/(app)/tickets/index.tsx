import AddTicketForm from "@/components/tickets/TicketForm";
import TicketList from "@/components/tickets/TicketCard";
import { createTicket, getAllTickets, Ticket } from "@/services/ticket.service";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Button, Platform, RefreshControl, SafeAreaView, StyleSheet, TextInput, View,Text,TouchableOpacity } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/build/Ionicons";

const Tickets = () => {
  const router = useRouter();
  const ticketsData: Ticket[] = [];
  const [yourTicketsData, setYourTicketsData] = useState<Ticket[]>(ticketsData);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>(yourTicketsData);
  const priorityMap = new Map<string, number>([
    ["critical", 1],
    ["high", 2],
    ["medium", 3],
    ["low", 4],
  ]);
  const statusMap = new Map<string, number>([
    ["open", 1],
    ["in progress", 2],
    ["closed", 3],
  ]);
  const getTickets = async () => {
    const tickets = await getAllTickets();
    setYourTicketsData(tickets);
  };

  useEffect(() => {
    getTickets(); 
  }, []);

  useEffect(() => {
    handleSearch(searchQuery); 
  }, [yourTicketsData]);

  const handleTicketPress = async (ticket: Ticket) => {
    getTickets();  
    router.push(`/tickets/${ticket.idTicket?.toString()}`);
  };

  const handleAddTicketList = () => {
    setIsModalVisible(true);
  };

  const handleAddTicket = async (ticket: Ticket) => {
    await createTicket({ nameTicket: ticket.name, priorityTicket: ticket.priority, statusTicket: ticket.status });
    getTickets();
    setIsModalVisible(false)
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };
  const sortByPriority = () => {
    const sorted = [...yourTicketsData].sort((a, b) => {
      const aValue = priorityMap.get(a.priority.toLowerCase()) ?? 999;
      const bValue = priorityMap.get(b.priority.toLowerCase()) ?? 999;
      return aValue - bValue; 
    });
    setYourTicketsData(sorted);
  };
  
  const sortByStatus = () => {
    const sorted = [...yourTicketsData].sort((a, b) => {
      const aValue = statusMap.get(a.status.toLowerCase()) ?? 999;
      const bValue = statusMap.get(b.status.toLowerCase()) ?? 999;
      return aValue - bValue;
    });
    setYourTicketsData(sorted);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query === "") {
      setFilteredTickets(yourTicketsData); 
    } else {
      const filtered = yourTicketsData.filter(ticket =>
        ticket.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredTickets(filtered); 
    }
  };

  return (
    
      <>
            <TextInput
        placeholder="Rechercher un ticket"
        value={searchQuery}
        onChangeText={handleSearch}
        style={styles.SearchBar}
      />
     <View style={styles.filterBtn}>
      <TouchableOpacity
        onPress={sortByPriority}
        style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
      >
        <Ionicons name="filter-outline" size={16} />
        <Text>Priorité</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={sortByStatus}
        style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
      >
        <Ionicons name="filter-outline" size={16} />
        <Text>Statut</Text>
      </TouchableOpacity>
    </View>
      <TicketList
      tickets={filteredTickets}
      onTicketRefresh={getTickets}
      onTicketPress={handleTicketPress}
      onAddTicket={handleAddTicketList} />
      <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginVertical: 10 }}>

</View>
      <AddTicketForm
        visible={isModalVisible}
        onClose={onModalClose}
        onSave={handleAddTicket} /></>
    
  );
};

const styles = StyleSheet.create({
  filterBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
    marginHorizontal: 10
  },
  SearchBar: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    marginHorizontal: 10,
  }})


export default Tickets;
