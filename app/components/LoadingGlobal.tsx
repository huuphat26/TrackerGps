/* eslint-disable react-native/no-color-literals */
import { createRef, useImperativeHandle, useState } from "react"
import { ActivityIndicator, StyleSheet, View } from "react-native"

interface ILoadingGlobalRef {
  start: (key?: string) => void
  end: (key?: string) => void
}

export const LoadingGlobalRef = createRef<ILoadingGlobalRef>()

const LoadingGlobal = () => {
  const [visible, setVisible] = useState(false)

  useImperativeHandle(LoadingGlobalRef, () => {
    return {
      start: () => {
        setVisible(true)
      },
      end: () => {
        setVisible(false)
      },
    }
  }, [])

  return (
    visible && (
      <View style={styles.root}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    )
  )
}

export default LoadingGlobal

const styles = StyleSheet.create({
  lottie: {
    height: 50,
    width: 50,
  },
  root: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    height: "100%",
    justifyContent: "center",
    position: "absolute",
    width: "100%",
  },
})
