import { colors } from '@/src/constants/colors'
import type { CommentData } from '@/src/hooks/useHighlightComments'
import { useSession } from '@/src/hooks/useSession'
import { timeAgo } from '@/src/utils/dates'
import { FontAwesome5 } from '@expo/vector-icons'
import { useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Text from '../shared/typography/Text'

type CommentsModalProps = {
  visible: boolean
  onClose: () => void
  comments: CommentData[]
  loading: boolean
  onAddComment: (content: string) => Promise<void>
  onDeleteComment: (commentId: string) => Promise<void>
}

const CommentsModal = ({
  visible,
  onClose,
  comments,
  loading,
  onAddComment,
  onDeleteComment,
}: CommentsModalProps) => {
  const insets = useSafeAreaInsets()
  const { session } = useSession()
  const currentUserId = session?.user.id

  const [inputText, setInputText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handlePost = async () => {
    const trimmed = inputText.trim()
    if (!trimmed || trimmed.length > 500) return

    setSubmitting(true)
    try {
      await onAddComment(trimmed)
      setInputText('')
    } catch (e) {
      console.warn('Post comment error', e)
    } finally {
      setSubmitting(false)
    }
  }

  const renderItem = ({ item }: { item: CommentData }) => {
    const isOwner = currentUserId === item.user_id
    const avatarUrl = item.profiles?.avatar_src
    const displayName = item.profiles?.full_name || 'Anonymous'

    return (
      <View style={styles.commentRow}>
        <Image
          source={
            avatarUrl
              ? { uri: avatarUrl }
              : require('@/assets/images/avatar-placeholder.jpg')
          }
          style={styles.avatar}
        />
        <View style={styles.commentContent}>
          <View style={styles.commentHeader}>
            <Text weight="semiBold" style={styles.authorText}>
              {displayName}
            </Text>
            <Text style={styles.timeText}>{timeAgo(item.created_at)}</Text>
          </View>
          <Text style={styles.bodyText}>{item.content}</Text>
        </View>

        {isOwner && (
          <Pressable
            onPress={() => onDeleteComment(item.id)}
            style={styles.deleteBtn}
          >
            <FontAwesome5 name="trash" size={12} color={colors.red.default} />
          </Pressable>
        )}
      </View>
    )
  }

  const isValidLength =
    inputText.trim().length > 0 && inputText.trim().length <= 500

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.dismissArea} onPress={onClose} />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) }]}
        >
          <View style={styles.header}>
            <Text weight="bold" style={styles.headerTitle}>
              Comments
            </Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <FontAwesome5
                name="times"
                size={20}
                color={colors.black.default}
              />
            </Pressable>
          </View>

          {loading ? (
            <View style={styles.loadingArea}>
              <ActivityIndicator color={colors.green.default} />
            </View>
          ) : (
            <FlatList
              data={comments}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyArea}>
                  <Text style={styles.emptyText}>Be the first to comment!</Text>
                </View>
              }
            />
          )}

          <View
            style={[styles.inputWrap, { paddingBottom: insets.bottom + 6 }]}
          >
            <TextInput
              style={styles.input}
              placeholder="Add a comment..."
              placeholderTextColor={colors.grey.default}
              value={inputText}
              onChangeText={setInputText}
              maxLength={500}
              multiline
            />
            <Pressable
              disabled={!isValidLength || submitting}
              onPress={handlePost}
              style={styles.postBtn}
            >
              {submitting ? (
                <ActivityIndicator color={colors.green.default} size="small" />
              ) : (
                <Text
                  weight="bold"
                  style={[
                    styles.postText,
                    (!isValidLength || submitting) && styles.postTextDisabled,
                  ]}
                >
                  Post
                </Text>
              )}
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  dismissArea: {
    flex: 1,
  },
  sheet: {
    backgroundColor: colors.white.default,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: '75%',
    overflow: 'hidden',
  },
  header: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.white.mellow,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  headerTitle: {
    fontSize: 16,
  },
  closeBtn: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  loadingArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyArea: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    color: colors.grey.default,
  },
  commentRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white.mellow,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  authorText: {
    fontSize: 13,
    color: colors.black.default,
  },
  timeText: {
    fontSize: 12,
    color: colors.grey.default,
  },
  bodyText: {
    fontSize: 14,
    color: colors.black.default,
    lineHeight: 20,
  },
  deleteBtn: {
    padding: 8,
    alignSelf: 'flex-start',
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.white.mellow,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.white.default,
  },
  input: {
    flex: 1,
    backgroundColor: colors.white.mellow,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    maxHeight: 100,
    fontSize: 14,
    color: colors.black.default,
  },
  postBtn: {
    marginLeft: 12,
    paddingVertical: 8,
    paddingHorizontal: 4,
    minWidth: 44,
    alignItems: 'center',
  },
  postText: {
    color: colors.green.default,
    fontSize: 15,
  },
  postTextDisabled: {
    color: colors.grey.dark,
  },
})

export default CommentsModal
