

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyA1Feo84fxdUWLavz1BR3hoC_xTvQXOl8c",
    authDomain: "amin-shop-27d86.firebaseapp.com",
      projectId: "amin-shop-27d86",
        storageBucket: "amin-shop-27d86.firebasestorage.app",
          messagingSenderId: "51299658823",
            appId: "1:51299658823:web:496c15ec9487fb99e1d562",
              measurementId: "G-8C4TY5B94X"
              };
              const app = getApps().length
                ? getApp()
                  : initializeApp(firebaseConfig);

                  const db = getFirestore(app);
const PRODUCTS = [
  { id: '1', name: 'Чихэвч', price: 25000, emoji: '🎧' },
  { id: '2', name: 'Усны сав', price: 12000, emoji: '🧴' },
  { id: '3', name: 'Үсний хавчаар', price: 5000, emoji: '🎀' },
  { id: '4', name: 'Цүнх', price: 35000, emoji: '👜' },
  { id: '5', name: 'Цамц', price: 28000, emoji: '👕' },
  { id: '6', name: 'Ном', price: 18000, emoji: '📚' },
];

const money = value => `${value.toLocaleString('en-US')} ₮`;

export default function App() {
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    address: '',
  });

  const [orderNumber, setOrderNumber] = useState(0);

  const count = cart.reduce((sum, p) => sum + p.quantity, 0);
  const total = cart.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0
  );

  function addItem(product) {
    setCart(old => {
      const found = old.find(p => p.id === product.id);

      if (found) {
        return old.map(p =>
          p.id === product.id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }

      return [...old, { ...product, quantity: 1 }];
    });
  }

  function changeQuantity(id, amount) {
    setCart(old =>
      old
        .map(p =>
          p.id === id
            ? { ...p, quantity: p.quantity + amount }
            : p
        )
        .filter(p => p.quantity > 0)
    );
  }

  function submitOrder() {
    if (cart.length === 0) {
      Alert.alert('Сагс хоосон байна', 'Эхлээд бараа сонгоно уу.');
      return;
    }

    if (
      !customer.name.trim() ||
      !customer.phone.trim() ||
      !customer.address.trim()
    ) {
      Alert.alert(
        'Мэдээлэл дутуу байна',
        'Нэр, утас, хүргэлтийн хаягаа бүгдийг оруулна уу.'
      );
      return;
    }

    const nextNumber = orderNumber + 1;
    setOrderNumber(nextNumber);

    Alert.alert(
      'Захиалгын туршилт амжилттай',
      `Захиалга №${nextNumber}\n` +
        `Нэр: ${customer.name}\n` +
        `Барааны тоо: ${count}\n` +
        `Нийт: ${money(total)}\n\n` +
        'Энэ бол туршилтын баталгаажуулалт. Захиалга эзэнд автоматаар илгээгдээгүй.',
      [
        {
          text: 'Ойлголоо',
          onPress: () => {
            setCart([]);
            setCustomer({ name: '', phone: '', address: '' });
          },
        },
      ]
    );
  }

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.logo}>💙 AMIN</Text>
      <Text style={styles.tagline}>Таны хүссэн бүхэн нэг дор</Text>

      <View style={styles.cartBox}>
        <Text style={styles.sectionTitle}>🛒 Таны сагс</Text>
        <Text style={styles.info}>Барааны тоо: {count}</Text>

        {cart.length === 0 ? (
          <Text style={styles.muted}>Сагсанд бараа алга.</Text>
        ) : (
          cart.map(item => (
            <View style={styles.cartItem} key={item.id}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>
                  {item.emoji} {item.name}
                </Text>
                <Text style={styles.muted}>
                  {money(item.price * item.quantity)}
                </Text>
              </View>

              <View style={styles.quantityRow}>
                <Pressable
                  accessibilityLabel="Барааны тоо хасах"
                  style={styles.qtyButton}
                  onPress={() => changeQuantity(item.id, -1)}
                >
                  <Text style={styles.qtyText}>−</Text>
                </Pressable>

                <Text style={styles.qtyText}>{item.quantity}</Text>

                <Pressable
                  accessibilityLabel="Барааны тоо нэмэх"
                  style={styles.qtyButton}
                  onPress={() => changeQuantity(item.id, 1)}
                >
                  <Text style={styles.qtyText}>+</Text>
                </Pressable>
              </View>
            </View>
          ))
        )}

        <Text style={styles.total}>Нийт: {money(total)}</Text>

        <Pressable
          style={styles.clearButton}
          onPress={() => setCart([])}
        >
          <Text style={styles.clearText}>Сагс хоослох</Text>
        </Pressable>
      </View>

      <Text style={styles.heading}>✨ Бүх бүтээгдэхүүн</Text>

      {PRODUCTS.map(product => (
        <View style={styles.product} key={product.id}>
          <Text style={styles.productEmoji}>{product.emoji}</Text>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.price}>{money(product.price)}</Text>

          <Pressable
            style={styles.primaryButton}
            onPress={() => addItem(product)}
          >
            <Text style={styles.primaryText}>+ Сагсанд нэмэх</Text>
          </Pressable>
        </View>
      ))}

      <View style={styles.form}>
        <Text style={styles.sectionTitle}>📦 Захиалгын мэдээлэл</Text>
        <Text style={styles.fieldLabel}>Таны нэр</Text>
        <TextInput
          style={styles.input}
          value={customer.name}
          onChangeText={name =>
            setCustomer(old => ({ ...old, name }))
          }
          placeholder="Нэрээ бичнэ үү"
          maxLength={80}
        />

        <Text style={styles.fieldLabel}>Утасны дугаар</Text>
        <TextInput
          style={styles.input}
          value={customer.phone}
          onChangeText={phone =>
            setCustomer(old => ({ ...old, phone }))
          }
          placeholder="Утасны дугаар"
          keyboardType="phone-pad"
          maxLength={20}
        />

        <Text style={styles.fieldLabel}>Хүргэлтийн хаяг</Text>
        <TextInput
          style={[styles.input, styles.addressInput]}
          value={customer.address}
          onChangeText={address =>
            setCustomer(old => ({ ...old, address }))
          }
          placeholder="Дүүрэг, хороо, байр, тоот"
          multiline
          maxLength={250}
        />

        <Pressable
          style={styles.primaryButton}
          onPress={submitOrder}
        >
          <Text style={styles.primaryText}>Захиалга шалгах</Text>
        </Pressable>

        <Text style={styles.note}>
          Туршилтын хувилбар: мэдээлэл серверт хадгалагдахгүй.
        </Text>
      </View>

      <Text style={styles.footer}>AMIN © 2026</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#EAF6FF' },
  content: { padding: 16, paddingBottom: 40 },
  logo: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#2583C5',
    marginTop: 24,
  },
  tagline: { color: '#526575', marginTop: 5, marginBottom: 20 },
  cartBox: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#C8E7FA',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2583C5',
    marginBottom: 12,
  },
  info: { fontSize: 16, marginBottom: 8 },
  muted: { color: '#657786', fontSize: 14 },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E3EEF5',
    gap: 8,
  },
  itemInfo: { flex: 1 },
  itemName: { fontWeight: 'bold', fontSize: 15, marginBottom: 4 },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  qtyButton: {
    backgroundColor: '#EAF6FF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  qtyText: { fontSize: 17, fontWeight: 'bold' },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#167447',
    marginTop: 14,
  },
  clearButton: {
    alignSelf: 'flex-start',
    padding: 10,
    backgroundColor: '#FCE7E7',
    borderRadius: 9,
    marginTop: 12,
  },
  clearText: { color: '#B42318', fontWeight: 'bold' },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#25394A',
    marginBottom: 14,
  },
  product: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 18,
    marginBottom: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D7EAF6',
  },
  productEmoji: { fontSize: 56, marginBottom: 8 },
  productName: { fontSize: 20, fontWeight: 'bold', marginBottom: 6 },
  price: { fontSize: 17, color: '#2583C5', fontWeight: 'bold' },
  primaryButton: {
    backgroundColor: '#2583C5',
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderRadius: 11,
    alignItems: 'center',
    marginTop: 14,
  },
  primaryText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 },
  form: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 18,
    marginTop: 10,
  },
  fieldLabel: { fontWeight: 'bold', marginTop: 12, marginBottom: 6 },
  input: {
    backgroundColor: '#F7FBFE',
    borderWidth: 1,
    borderColor: '#C8DDEA',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  addressInput: { minHeight: 76, textAlignVertical: 'top' },
  note: { color: '#657786', fontSize: 12, marginTop: 12 },
  footer: { textAlign: 'center', color: '#718096', marginTop: 26 },
});
