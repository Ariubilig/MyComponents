import "./SkeletonExample.css";
import { Skeleton } from "../../UI/Skeleton/Skeleton";
import React, { useEffect, useState } from "react";
import axios from "axios";


function SkeletonExample() {

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    let mounted = true;
    axios
      .get("https://jsonplaceholder.typicode.com/photos?_limit=6")
      .then((res) => {
        if (mounted) setItems(res.data || []);
      })
      .catch(() => {
        if (mounted) setItems([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="skeleton-demo">
      {/* text loading example */}
      <div className="demo-section">
        <h3>Text skeleton</h3>
        {loading ? (
          <Skeleton variant="text" lines={3} />
        ) : (
          <div className="loaded-paragraph">
            Энэ бол текст хэсгийн ачаалалт дууссаны дараах жишээ. Skeleton нь
            ачаалж байх үед UX-ийг сайжруулна.
          </div>
        )}
      </div>

      {/* Cards list loading example */}
      <div className="demo-section">
        <h3>Cards (image + texts)</h3>

        {loading ? (
          <div className="cards-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card">
                <Skeleton variant="rect" className="skeleton-card-img" />
                <div className="card-body">
                  <Skeleton variant="text" className="w-70" />
                  <Skeleton variant="text" className="w-50" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="cards-grid">
            {items.map((it) => (
              <div key={it.id} className="card">
                <img className="card-img" src={it.thumbnailUrl} alt={it.title} />
                <div className="card-body">
                  <div className="card-title">{it.title.slice(0, 24)}</div>
                  <div className="card-text">Sample description for card.</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Avatar + lines example */}
      <div className="demo-section">
        <h3>Profile</h3>
        {loading ? (
          <div className="avatar-row">
            <Skeleton variant="circle" className="size-48" />
            <div className="avatar-texts">
              <Skeleton variant="text" className="w-70" />
              <Skeleton variant="text" className="w-50" />
            </div>
          </div>
        ) : (
          <div className="avatar-row">
            <img
              className="avatar size-48"
              src={`https://i.pravatar.cc/96?img=12`}
              alt="avatar"
            />
            <div className="avatar-loaded">
              <div className="name">John Doe</div>
              <div className="role">Frontend Developer</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SkeletonExample;