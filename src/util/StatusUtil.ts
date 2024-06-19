export const getCategoryStatus = (
  totalRacers: number,
  racersOnCourse: number,
) => {
  const baseStyle = {
    height: '25px',
    width: '25px',
    borderRadius: '25%',
    marginRight: '10px',
  };

  if (totalRacers === 0) {
    return { ...baseStyle, backgroundColor: 'rgb(150, 150, 150)' };
  }

  if (racersOnCourse === 0) {
    return { ...baseStyle, backgroundColor: 'rgb(0, 200, 0)' };
  }

  if (racersOnCourse === totalRacers) {
    return { ...baseStyle, backgroundColor: 'rgb(200, 0, 0)' };
  }

  return { ...baseStyle, backgroundColor: 'rgb(220, 220, 0)' };
};

export const getCategoryStatusString = (
  totalRacers: number,
  racersOnCourse: number,
) => {
  if (totalRacers === 0) {
    return 'N/A';
  }

  return `${totalRacers - racersOnCourse}/${totalRacers} (${racersOnCourse})`;
};
