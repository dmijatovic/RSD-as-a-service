
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Badge from '@mui/material/Badge'
import {MentionItemProps, MentionTypeKeys} from '~/types/Mention'
import MentionViewItem from './MentionViewItem'

type MentionSectionListProps = {
  title: string
  type: MentionTypeKeys,
  items: MentionItemProps[]
}

export default function MentionViewList({title, type, items}: MentionSectionListProps) {
    // do not render accordion/section if no items
  if (!items || items.length===0) return null
  // debugger
  return (
    <Accordion
      data-testid='mentions-section-for-type'
      sx={{
        boxShadow: 0,
        borderTop: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'secondary.light',
        // remove line above the accordion
        '&:before': {
          height: '0px'
        },
        '&:last-child': {
          borderBottom: '1px solid',
          borderColor: 'divider',
        }
      }}>
      <AccordionSummary
        expandIcon={
          <ExpandMoreIcon />
        }
        aria-controls={`panel1-content-${type}`}
        id={`panel1-header-${type}`}
        sx={{
          position: 'sticky',
          top: 0,
          backgroundColor: 'secondary.main',
          padding: '0rem',
          '&:hover': {
            opacity:0.95
          }
        }}
      >
        <Badge
          badgeContent={items.length ?? null}
          color="secondary"
          sx={{
            '& .MuiBadge-badge': {
              right: '-1rem',
              top: '0.25rem',
              border: '1px solid',
              borderColor: 'secondary.contrastText',
              color: 'secondary.contrastText',
              fontWeight: 500
            },
          }}
        >
          <div className="text-xl">{title}</div>
        </Badge>
      </AccordionSummary>
      <AccordionDetails sx={{
        // set max height to avoid large shifts
        maxHeight: '32rem',
        //avoid resizing when scrollbar appears
        overflow: 'overlay',
        padding: '0rem 0rem'
      }}>
        <ul>
          {items.map((item, pos) => {
            return (
              <li key={pos} className="p-4 hover:bg-grey-200 hover:text-black">
                <MentionViewItem
                  pos={pos+1}
                  item={item}
                />
              </li>
            )
            })
          }
        </ul>
      </AccordionDetails>
    </Accordion>
  )
}
