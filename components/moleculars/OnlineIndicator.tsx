import React, { useEffect, useState } from 'react';
import { StatusBar, View, Text } from 'react-native';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import commonStyles from '@/styles/commonStyles';

export default function OnlineIndicator() {
  const isOnline = useOnlineStatus()
  const styles = commonStyles()
  const [visible, setVisiblity] = useState(false)

  useEffect(() => {
    setVisiblity(true)
    setTimeout(() => {
        setVisiblity(false)
    }, 5000)
  }, [isOnline])

  return (
    <>
        {visible && <View style={[styles.statusBarContainer, { backgroundColor: isOnline ? '#4CAF50' : '#F44336' }]}>
            <StatusBar
                barStyle={isOnline ? 'light-content' : 'dark-content'}
                backgroundColor={isOnline ? '#4CAF50' : '#F44336'}
            />
            <Text style={styles.statusText}>
                {isOnline ? 'Online' : 'Offline - Please check your connection'}
            </Text>
        </View>}
    </>
  );
}
