import { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react-native';
import { colors, fonts, radius, subjectColors } from '@/constants/theme';

type Subject = {
  id: number;
  name: string;
  teacher: string | null;
  units: number;
  color: string;
};

function initials(name: string) {
  const words = name.trim().split(/\s+/);
  const text = words.length > 1 ? words[0][0] + words[1][0] : name.slice(0, 2);
  return text.toUpperCase();
}

export default function SubjectsScreen() {
  const db = useSQLiteContext();
  const router = useRouter();

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState<Subject | null>(null);
  const [name, setName] = useState('');
  const [teacher, setTeacher] = useState('');
  const [units, setUnits] = useState('3');
  const [color, setColor] = useState(subjectColors[0]);

  const load = useCallback(async () => {
    const rows = await db.getAllAsync<Subject>('SELECT * FROM subjects ORDER BY name');
    setSubjects(rows);
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const totalUnits = subjects.reduce((sum, s) => sum + (s.units || 0), 0);

  function openNew() {
    setEditing(null);
    setName('');
    setTeacher('');
    setUnits('3');
    setColor(subjectColors[subjects.length % subjectColors.length]);
    setVisible(true);
  }

  function openEdit(s: Subject) {
    setEditing(s);
    setName(s.name);
    setTeacher(s.teacher ?? '');
    setUnits(String(s.units));
    setColor(s.color);
    setVisible(true);
  }

  async function save() {
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert('Name needed', 'Please type the subject name.');
      return;
    }
    const unitValue = parseInt(units, 10) || 0;
    const teacherValue = teacher.trim() || null;

    if (editing) {
      await db.runAsync(
        'UPDATE subjects SET name = ?, teacher = ?, units = ?, color = ? WHERE id = ?',
        trimmed, teacherValue, unitValue, color, editing.id
      );
    } else {
      await db.runAsync(
        'INSERT INTO subjects (name, teacher, units, color) VALUES (?, ?, ?, ?)',
        trimmed, teacherValue, unitValue, color
      );
    }
    setVisible(false);
    load();
  }

  function confirmDelete() {
    if (!editing) return;
    Alert.alert(
      'Delete this subject?',
      'Its classes, deadlines, grades, notes and decks will be deleted too.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await db.runAsync('DELETE FROM subjects WHERE id = ?', editing.id);
            setVisible(false);
            load();
          },
        },
      ]
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Header */}
      <View style={{ paddingTop: 48, paddingHorizontal: 20, paddingBottom: 8 }}>
        <Pressable
          onPress={() => router.back()}
          accessibilityLabel="Back"
          style={{ width: 44, height: 44, marginLeft: -10, justifyContent: 'center' }}
        >
          <ChevronLeft size={24} color={colors.text} />
        </Pressable>

        <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted, letterSpacing: 0.8 }}>
              {subjects.length} SUBJECTS · {totalUnits} UNITS
            </Text>
            <Text style={{ fontFamily: fonts.serif, fontSize: 28, color: colors.text }}>Subjects</Text>
          </View>
          <Pressable
            onPress={openNew}
            accessibilityLabel="Add subject"
            style={{
              height: 44,
              paddingHorizontal: 16,
              borderRadius: radius.pill,
              backgroundColor: colors.primary,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Plus size={18} color={colors.onPrimary} />
            <Text style={{ fontFamily: fonts.semibold, fontSize: 14, color: colors.onPrimary }}>Add</Text>
          </Pressable>
        </View>
      </View>

      {/* List */}
      <FlatList
        data={subjects}
        keyExtractor={(s) => String(s.id)}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 40 }}
        ListEmptyComponent={
          <View style={{ paddingTop: 60, alignItems: 'center', gap: 6 }}>
            <Text style={{ fontFamily: fonts.serif, fontSize: 20, color: colors.text }}>No subjects yet</Text>
            <Text style={{ fontFamily: fonts.regular, fontSize: 14, color: colors.textMuted }}>
              Tap Add to create your first one.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => openEdit(item)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
              paddingVertical: 14,
              borderTopWidth: 1,
              borderTopColor: colors.border,
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: radius.md,
                backgroundColor: item.color,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: '#FFFFFF' }}>{initials(item.name)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: fonts.semibold, fontSize: 16, color: colors.text }}>{item.name}</Text>
              <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted }}>
                {item.teacher ? `${item.teacher} · ` : ''}
                {item.units} units
              </Text>
            </View>
            <ChevronRight size={18} color={colors.textMuted} />
          </Pressable>
        )}
      />

      {/* Add / edit sheet */}
      <Modal visible={visible} animationType="slide" transparent onRequestClose={() => setVisible(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(17,26,22,0.4)' }}
        >
          <Pressable style={{ flex: 1 }} onPress={() => setVisible(false)} />
          <View
            style={{
              backgroundColor: colors.surface,
              borderTopLeftRadius: radius.lg,
              borderTopRightRadius: radius.lg,
              padding: 20,
              gap: 14,
            }}
          >
            <Text style={{ fontFamily: fonts.serif, fontSize: 22, color: colors.text }}>
              {editing ? 'Edit subject' : 'New subject'}
            </Text>

            <View style={{ gap: 6 }}>
              <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.textMuted }}>Subject name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="e.g. Data Structures"
                placeholderTextColor={colors.textMuted}
                style={inputStyle}
              />
            </View>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1, gap: 6 }}>
                <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.textMuted }}>Teacher</Text>
                <TextInput
                  value={teacher}
                  onChangeText={setTeacher}
                  placeholder="Optional"
                  placeholderTextColor={colors.textMuted}
                  style={inputStyle}
                />
              </View>
              <View style={{ width: 90, gap: 6 }}>
                <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.textMuted }}>Units</Text>
                <TextInput
                  value={units}
                  onChangeText={setUnits}
                  keyboardType="number-pad"
                  style={inputStyle}
                />
              </View>
            </View>

            <View style={{ gap: 8 }}>
              <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.textMuted }}>Color</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                {subjectColors.map((c) => (
                  <Pressable
                    key={c}
                    onPress={() => setColor(c)}
                    accessibilityLabel={`Color ${c}`}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: radius.md,
                      backgroundColor: c,
                      borderWidth: color === c ? 3 : 0,
                      borderColor: colors.text,
                    }}
                  />
                ))}
              </View>
            </View>

            <Pressable
              onPress={save}
              style={{
                height: 52,
                borderRadius: radius.md,
                backgroundColor: colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontFamily: fonts.semibold, fontSize: 16, color: colors.onPrimary }}>Save</Text>
            </Pressable>

            {editing && (
              <Pressable onPress={confirmDelete} style={{ height: 44, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: fonts.semibold, fontSize: 15, color: colors.danger }}>Delete subject</Text>
              </Pressable>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const inputStyle = {
  height: 48,
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: radius.md,
  paddingHorizontal: 14,
  fontFamily: fonts.regular,
  fontSize: 16,
  color: colors.text,
  backgroundColor: colors.bg,
} as const;