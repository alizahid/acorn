import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import { useRef } from 'react'
import { createCallable } from 'react-call'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { type MenuItemOption } from '~/components/common/menu'
import { listProps } from '~/lib/common'

import { SheetBackDrop } from '../components/sheets/back-drop'
import { SheetHeader } from '../components/sheets/header'
import { SheetItem } from '../components/sheets/item'

export type MenuSheetProps = {
  options: Array<MenuItemOption>
  title: string
  value?: string
}

export type MenuSheetReturn = MenuItemOption

export const MenuSheet = createCallable<MenuSheetProps, MenuSheetReturn>(
  function Component({ call, options, title, value }) {
    const { styles } = useStyles(stylesheet)

    const sheet = useRef<BottomSheet>(null)

    return (
      <BottomSheet
        backdropComponent={SheetBackDrop}
        backgroundStyle={styles.background}
        enablePanDownToClose
        handleComponent={null}
        maxDynamicContentSize={styles.maxHeight.height}
        ref={sheet}
        style={styles.main}
      >
        <BottomSheetFlatList
          {...listProps}
          ListHeaderComponent={<SheetHeader title={title} />}
          contentContainerStyle={styles.content}
          data={options}
          renderItem={({ item }) => (
            <SheetItem
              icon={item.icon}
              key={item.value}
              label={item.label}
              left={item.left}
              onPress={() => {
                call.end(item)

                sheet.current?.close()
              }}
              selected={item.value === value}
            />
          )}
        />
      </BottomSheet>
    )
  },
  250,
)

const stylesheet = createStyleSheet((theme, runtime) => ({
  background: {
    backgroundColor: theme.colors.gray[1],
    borderRadius: 0,
  },
  content: {
    paddingBottom: runtime.insets.bottom,
  },
  main: {
    borderCurve: 'continuous',
    borderTopLeftRadius: theme.radius[5],
    borderTopRightRadius: theme.radius[5],
    overflow: 'hidden',
  },
  maxHeight: {
    height: runtime.screen.height * 0.8,
  },
}))
