import styled from 'styled-components';
import Countdown from 'react-countdown';
// import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';

const Paper = styled.section`
	background-color: var(--surface1);
	border: 0.1rem solid hsl(var(--brand-hue) 10% 50% / 15%);
	border-radius: 1rem;
	padding: var(--space-ml);
	box-shadow: var(--box-shadow-md);
	h4 + h4 {
		margin-top: var(--space-xs);
	}
`;

const MintCountdownContainer = styled.div`
  display: 'flex';
  padding: theme.spacing(0);
  
  & > *: {
    margin: theme.spacing(0.4);
    width: theme.spacing(6);
    height: theme.spacing(6);
    display: 'flex';
    flexDirection: 'column';
    alignContent: 'center';
    alignItems: 'center';
    justifyContent: 'center';
    background: '#384457';
    color: 'white';
    borderRadius: 5;
    fontSize: 10;
  }
`;

const MintDone = styled.span`
  display: 'flex';
  margin: 0;
  marginBottom: theme.spacing(0.5);
  height: theme.spacing(3.5);
  padding: theme.spacing(1);
  flexDirection: 'column';
  alignContent: 'center';
  alignItems: 'center';
  justifyContent: 'center';
  background: '#384457';
  color: 'white';
  borderRadius: 5;
  fontWeight: 'bold';
  fontSize: 18;
`;

const TimeSpan = styled.span`
  fontWeight: 'bold',
  fontSize: 18,
`;

// const useStyles = makeStyles((theme: Theme) =>
//   createStyles({
//     root: {
//       display: 'flex',
//       padding: theme.spacing(0),
//       '& > *': {
//         margin: theme.spacing(0.4),
//         width: theme.spacing(6),
//         height: theme.spacing(6),
//         display: 'flex',
//         flexDirection: 'column',
//         alignContent: 'center',
//         alignItems: 'center',
//         justifyContent: 'center',
//         background: '#384457',
//         color: 'white',
//         borderRadius: 5,
//         fontSize: 10,
//       },
//     },
//     done: {
//       display: 'flex',
//       margin: 0,
//       marginBottom: theme.spacing(0.5),
//       height: theme.spacing(3.5),
//       padding: theme.spacing(1),
//       flexDirection: 'column',
//       alignContent: 'center',
//       alignItems: 'center',
//       justifyContent: 'center',
//       background: '#384457',
//       color: 'white',
//       borderRadius: 5,
//       fontWeight: 'bold',
//       fontSize: 18,
//     },
//     item: {
//       fontWeight: 'bold',
//       fontSize: 18,
//     },
//   }),
// );

interface MintCountdownProps {
  date: Date | undefined;
  style?: React.CSSProperties;
  status?: string;
  onComplete?: () => void;
}

interface MintCountdownRender {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
}

export const MintCountdown: React.FC<MintCountdownProps> = ({
  date,
  status,
  style,
  onComplete,
}) => {
  // const classes = useStyles();
  const renderCountdown = ({
    days,
    hours,
    minutes,
    seconds,
    completed,
  }: MintCountdownRender) => {
    hours += days * 24;
    if (completed) {
      return status ? <MintDone>{status}</MintDone> : null;
    } else {
      return (
        <MintCountdownContainer>
          <Paper>
            <TimeSpan>
              {hours < 10 ? `0${hours}` : hours}
            </TimeSpan>
            <span>hrs</span>
          </Paper>
          <Paper>
            <TimeSpan>
              {minutes < 10 ? `0${minutes}` : minutes}
            </TimeSpan>
            <span>mins</span>
          </Paper>
          <Paper>
            <TimeSpan>
              {seconds < 10 ? `0${seconds}` : seconds}
            </TimeSpan>
            <span>secs</span>
          </Paper>
        </MintCountdownContainer>
      );
    }
  };

  if (date) {
    return (
      <Countdown
        date={date}
        onComplete={onComplete}
        renderer={renderCountdown}
      />
    );
  } else {
    return null;
  }
};
