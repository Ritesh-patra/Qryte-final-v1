import React from 'react'

type Props = {
  count: number
  onOpen: () => void
}

const CartButton: React.FC<Props> = ({ count, onOpen }) => {
  return (
    <div>
      <button
        onClick={onOpen}
        aria-label="Open cart"
        style={{
          position: 'fixed',
          right: 20,
          bottom: 20,
          width: 56,
          height: 56,
          borderRadius: 28,
          background: '#1976d2',
          color: '#fff',
          border: 'none',
          boxShadow: '0 6px 18px rgba(25,118,210,0.2)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20,
        }}
      >
        🧾
        {count > 0 && (
          <span
            style={{
              position: 'absolute',
              right: 12,
              top: 8,
              background: '#ff5252',
              width: 20,
              height: 20,
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {count}
          </span>
        )}
      </button>
    </div>
  )
}

export default CartButton
