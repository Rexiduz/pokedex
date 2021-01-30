import React from 'react'

import { Progress, Row, Col, Typography } from 'antd'
import { Box, Text } from 'components/atoms'
import { CloseOutlined } from '@ant-design/icons'
import HappyIcon from 'assets/image/cute.png'

const floatingProps = {
  className: 'absolute add-button cursor-pointer',
  top: '1rem',
  right: '1rem',
  inject: ({ theme }) =>
    `
      color: ${theme.colors.colorAddButton}; 
      display: none; transition: all 0.2s;
      :active {top: calc(1rem + 2px);}
    `
}

const ListItem = ({
  style,
  className,
  onAdd,
  onDelete,
  barSpan = 4,
  ...props
}) => {
  const { imageUrl, name, hp, attacks = [], weaknesses = [] } = props
  const [, ...progresses] = React.useMemo(() => {
    const _hp = hp >= 100 ? 100 : 0
    const str = attacks.length * 50
    const _str = str >= 100 ? 100 : str
    const weak = weaknesses.length * 50
    const _weaknesses = weak >= 100 ? 100 : weak
    const damage = attacks.reduce((sum, item) => {
      const value = item.damage

      const pattern = /[+x]/
      return pattern.test(value)
        ? sum + Number(value.replace(pattern, ''))
        : sum
    }, 0)

    const happiness = (_hp / 10 + damage / 10 + 10 - _weaknesses) / 5

    return [
      happiness,
      { label: 'HP', value: _hp },
      { label: 'STR', value: _str },
      { label: 'WEAK', value: _weaknesses }
    ]
  }, [attacks, hp, weaknesses.length])

  return (
    <Box
      className={'flex relative user-select-none ' + className}
      style={style}
      p="1rem"
      mb="1rem"
      inject={({ theme }) =>
        `
        height: 268px;
        overflow: auto;
        background: ${theme.colors.cardBackground}; 
        box-shadow: ${theme.colors.cardBoxShadow} 0px 2px 8px 0px;
        :hover { 
          box-shadow: ${theme.colors.cardBoxShadowHover} 0px 2px 8px 0px;
          .add-button { display: unset; } 
        }
        `
      }
    >
      {onAdd && (
        <Text {...floatingProps} fontSize="1.5rem" onClick={onAdd}>
          Add
        </Text>
      )}
      {onDelete && (
        <Box {...floatingProps} onClick={onDelete}>
          <CloseOutlined style={{ fontSize: 26 }} />
        </Box>
      )}
      <img
        src={imageUrl}
        alt={name}
        style={{ width: 160, height: 220 }}
        loading="lazy"
      />
      <Box flex="1" px="2rem" py="0.25rem">
        <Text
          $title
          fontSize="2.25rem"
          className="ant-typography-ellipsis-single-line"
          mb="0.3rem"
        >
          {name}
        </Text>
        {progresses.map((item, index) => {
          return (
            <Row key={index} style={{ marginBottom: '0.25rem' }}>
              <Col span={barSpan}>
                <Text fontSize="1.2rem">{item.label}</Text>
              </Col>
              <Col span={14}>
                <Box
                  inject={({ theme }) =>
                    `.ant-progress-bg{background: ${theme?.colors?.levelTubeValueBackground};}`
                  }
                >
                  <Progress
                    strokeWidth={'20px'}
                    percent={item.value}
                    showInfo={false}
                  />
                </Box>
              </Col>
            </Row>
          )
        })}
        <Box>
          {[...new Array(5)].map((_, index) => {
            const size = 34

            return (
              <img
                key={index}
                src={HappyIcon}
                alt="happy"
                loading="lazy"
                style={{ width: size, height: size, marginRight: 3 }}
              />
            )
          })}
        </Box>
      </Box>
    </Box>
  )
}

export default ListItem
